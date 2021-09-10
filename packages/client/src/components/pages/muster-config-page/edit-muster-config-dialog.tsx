import _ from 'lodash';
import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid, IconButton,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment-timezone';
import { Autocomplete } from '@material-ui/lab';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { DaysOfTheWeek, MusterConfigurationData, SavedFilterSerialized } from '@covid19-reports/shared';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import useStyles from './edit-muster-config-dialog.styles';
import { ApiMusterConfiguration } from '../../../models/api-response';
import { formatErrorMessage } from '../../../utility/errors';
import { ReportSchemaSelector } from '../../../selectors/report-schema.selector';
import { validateMusterConfiguration } from '../../../utility/muster-utils';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { Dialog } from '../../dialog/dialog';
import { MusterClient } from '../../../client/muster.client';
import { SavedFilterSelector } from '../../../selectors/saved-filter.selector';

export interface EditMusterConfigDialogProps {
  open: boolean;
  orgId?: number;
  musterConfig?: ApiMusterConfiguration;
  onClose?: () => void;
  onError?: (error: string) => void;
}

type MusterFilterConfig = {
  id: number;
  name: string;
  params: {
    [key: string]: string;
  };
};

export const EditMusterConfigDialog = (props: EditMusterConfigDialogProps) => {
  const { open, orgId, musterConfig, onClose, onError } = props;
  const classes = useStyles();
  const reports = useAppSelector(ReportSchemaSelector.all);
  const availableFilters = _.sortBy(useAppSelector(SavedFilterSelector.rosterEntry), 'name');
  const [formDisabled, setFormDisabled] = useState(false);
  const existingMusterConfig: boolean = !!musterConfig;
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null);
  const today = moment().format('Y-M-D');
  const start = moment(`${today} 00:00`, 'Y-M-D HH:mm');
  let initialStartTime = start.toISOString();
  let initialStartTimeDate = start.toDate();
  if (musterConfig) {
    if (musterConfig.days != null) {
      initialStartTime = musterConfig.startTime;
      initialStartTimeDate = moment(`${today} ${musterConfig.startTime}`, 'Y-M-D HH:mm').toDate();
    } else {
      // Timestamp is in UTC, convert it to the correct timezone, then to local (without changing time) since
      // date/time pickers are always in local time
      initialStartTimeDate = moment(musterConfig.startTime).tz(musterConfig.timezone).tz(moment.tz.guess(), true).toDate();
      initialStartTime = initialStartTimeDate.toISOString();
    }
  }
  const [days, setDays] = useState(musterConfig ? musterConfig.days : DaysOfTheWeek.None);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [startTimeDate, setStartTimeDate] = useState(initialStartTimeDate);
  const [timezone, setTimezone] = useState(musterConfig ? musterConfig.timezone : moment.tz.guess());
  const [durationHours, setDurationHours] = useState(musterConfig ? musterConfig.durationMinutes / 60 : 2);
  const [reportId, setReportId] = useState(musterConfig ? musterConfig.reportSchema.id : reports[0].id);
  const [isOneTime, setIsOneTime] = useState(musterConfig ? !musterConfig.days : false);
  const [filters, setFilters] = useState<MusterFilterConfig[]>(musterConfig ? _.sortBy(musterConfig.filters.map(f => {
    return { id: f.filter.id, name: f.filter.name, params: f.filterParams };
  }), 'name') : []);
  const [selectedFilterID, setSelectedFilterID] = useState(-1);
  const [filtersChanged, setFiltersChanged] = useState(false);

  if (!open) {
    return null;
  }

  const setOneTime = (oneTime: boolean) => {
    const newDate = start.toDate();
    setStartTimeDate(newDate);
    setStartTime(newDate.toISOString());
    setIsOneTime(oneTime);
    if (oneTime) {
      setDays(null);
    } else {
      setDays(DaysOfTheWeek.None);
    }
  };

  const setMusterTimezone = () => (event: any, tz: string) => {
    setTimezone(tz);
  };

  const onSelectedFilterChanged = (event: React.ChangeEvent<{ value: unknown }>) => {
    console.log('Filter changed: ', event);
    setSelectedFilterID(parseInt(event.target.value as string));
  };

  const setMusterReportId = (event: React.ChangeEvent<{ value: unknown }>) => {
    setReportId(event.target.value as string);
  };

  const setMusterDuration = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = Math.max(0.5, parseFloat(event.target.value));
    if (Number.isNaN(value)) {
      value = 0.5;
    }
    setDurationHours(value);
  };

  const setMusterStartTime = () => (date: MaterialUiPickersDate) => {
    if (!date) {
      return;
    }
    setStartTimeDate(date.toDate());
    setStartTime(isOneTime ? date.toISOString() : date.format('HH:mm'));
  };

  const getFinalStartTime = () => {
    if (isOneTime) {
      // Set the selected timezone without adjusting time
      return moment(startTimeDate).tz(timezone, true).toDate().toISOString();
    }
    return startTime;
  };

  const toggleMusterDay = (day: DaysOfTheWeek) => () => {
    if (formDisabled) {
      return;
    }
    // eslint-disable-next-line no-bitwise
    setDays(days! ^ day);
  };

  const validateMusterWindow = () => {
    const validation = validateMusterConfiguration([{
      id: 0,
      days,
      startTime: getFinalStartTime(),
      timezone,
      durationMinutes: durationHours * 60,
      reportSchema: reports.find(r => r.id === reportId)!,
      filters: [],
    }]);
    if (validation) {
      setErrorMessage(validation);
      return false;
    }
    return true;
  };

  const onSave = async () => {
    if (!validateMusterWindow()) {
      return;
    }
    setFormDisabled(true);
    const body: MusterConfigurationData = {
      days,
      startTime: getFinalStartTime(),
      timezone,
      durationMinutes: durationHours * 60,
      reportId,
      filters,
    };
    try {
      if (existingMusterConfig) {
        await MusterClient.updateMusterConfig(orgId!, musterConfig!.id, body);
      } else {
        await MusterClient.addMusterConfig(orgId!, body);
      }
    } catch (error) {
      if (onError) {
        onError(formatErrorMessage(error));
      }
      setFormDisabled(false);
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  const addFilter = () => {
    setFilters(prevState => {
      let filterToAdd: SavedFilterSerialized | undefined;
      const available = availableFilters.filter(filterNotAdded);
      if (available.length === 0) {
        console.log('none available', available);
        return prevState;
      }
      if (selectedFilterID < 0) {
        filterToAdd = available[0];
      } else {
        filterToAdd = available.find(f => f.id === selectedFilterID);
      }
      if (!filterToAdd) {
        console.log('could not find', selectedFilterID, available);
        return prevState;
      }
      return _.sortBy([...prevState, {
        id: filterToAdd.id,
        name: filterToAdd.name,
        params: {},
      }], 'name');
    });
    setSelectedFilterID(-1);
    setFiltersChanged(true);
  };

  const removeFilter = (id: number) => {
    console.log('Remove filter: ', id);
    setFilters(prevState => {
      return _.chain(prevState)
        .filter(f => f.id !== id)
        .sortBy('name')
        .value();
    });
    setSelectedFilterID(-1);
    setFiltersChanged(true);
  };

  const filterNotAdded = (filter: SavedFilterSerialized) => {
    return !filters.find(f => f.id === filter.id);
  };

  const canSave = () => {
    if (!musterConfig) {
      return true;
    }
    return days !== musterConfig.days
      || startTime !== musterConfig.startTime
      || timezone !== musterConfig.timezone
      || reportId !== musterConfig.reportSchema.id
      || durationHours !== musterConfig.durationMinutes / 60
      || filtersChanged;
  };

  const dayButtonClass = (day: DaysOfTheWeek) => {
    if (errorMessage && days === DaysOfTheWeek.None) {
      return classes.dayButtonError;
    }
    // eslint-disable-next-line no-bitwise
    const onOffClass = (days ?? 0) & day ? classes.dayButtonOn : classes.dayButtonOff;

    return clsx(onOffClass, {
      [classes.dayButtonDisabled]: false,
    });
  };

  /* eslint-disable no-bitwise */
  return (
    <Dialog className={classes.root} maxWidth="lg" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingMusterConfig ? 'Edit Muster Configuration' : 'New Muster Configuration'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={isOneTime}
                  disabled={formDisabled}
                  onChange={(event, checked: boolean) => setOneTime(checked)}
                  name="One-time Muster"
                  color="primary"
                />
              )}
              label="One-time Muster"
            />
            <Table aria-label="muster table" className={classes.musterTable}>
              <TableHead>
                <TableRow>
                  <TableCell>Report Type</TableCell>
                  <TableCell className={classes.daysColumn}>{ isOneTime ? 'Date' : 'Schedule' }</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>Time Zone</TableCell>
                  <TableCell>Duration (Hrs)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.reportCell}>
                    <Select
                      id="muster-report-type"
                      native
                      value={reportId}
                      disabled={formDisabled}
                      onChange={setMusterReportId}
                    >
                      {reports
                      && reports.map(report => (
                        <option key={report.id} value={report.id}>
                          {report.name}
                        </option>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    {!isOneTime ? (
                      <div className={classes.dayButtons}>
                        <Avatar
                          className={dayButtonClass(DaysOfTheWeek.Sunday)}
                          onClick={toggleMusterDay(DaysOfTheWeek.Sunday)}
                        >
                          Su
                        </Avatar>
                        <Avatar
                          className={dayButtonClass(DaysOfTheWeek.Monday)}
                          onClick={toggleMusterDay(DaysOfTheWeek.Monday)}
                        >
                          Mo
                        </Avatar>
                        <Avatar
                          className={dayButtonClass(DaysOfTheWeek.Tuesday)}
                          onClick={toggleMusterDay(DaysOfTheWeek.Tuesday)}
                        >
                          Tu
                        </Avatar>
                        <Avatar
                          className={dayButtonClass(DaysOfTheWeek.Wednesday)}
                          onClick={toggleMusterDay(DaysOfTheWeek.Wednesday)}
                        >
                          We
                        </Avatar>
                        <Avatar
                          className={dayButtonClass(DaysOfTheWeek.Thursday)}
                          onClick={toggleMusterDay(DaysOfTheWeek.Thursday)}
                        >
                          Th
                        </Avatar>
                        <Avatar
                          className={dayButtonClass(DaysOfTheWeek.Friday)}
                          onClick={toggleMusterDay(DaysOfTheWeek.Friday)}
                        >
                          Fr
                        </Avatar>
                        <Avatar
                          className={dayButtonClass(DaysOfTheWeek.Saturday)}
                          onClick={toggleMusterDay(DaysOfTheWeek.Saturday)}
                        >
                          Sa
                        </Avatar>
                      </div>
                    ) : (
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                          id="muster-date-time"
                          disabled={formDisabled}
                          format="MMMM D, yyyy"
                          value={startTimeDate}
                          InputProps={{ disableUnderline: true }}
                          onChange={setMusterStartTime()}
                        />
                      </MuiPickersUtilsProvider>
                    )}
                  </TableCell>
                  <TableCell>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <TimePicker
                        id="muster-start-time"
                        disabled={formDisabled}
                        value={startTimeDate}
                        InputProps={{ disableUnderline: true }}
                        onChange={setMusterStartTime()}
                      />
                    </MuiPickersUtilsProvider>
                  </TableCell>
                  <TableCell className={classes.timeZoneCell}>
                    <Autocomplete
                      id="muster-timezone"
                      value={timezone}
                      disabled={formDisabled}
                      disableClearable
                      options={moment.tz.names()}
                      noOptionsText="No matching time zones"
                      renderInput={params => (
                        <TextField {...params} InputProps={{ ...params.InputProps, disableUnderline: true }} />
                      )}
                      onChange={setMusterTimezone()}
                    />
                  </TableCell>
                  <TableCell className={classes.durationCell}>
                    <TextField
                      disabled={formDisabled}
                      onChange={setMusterDuration()}
                      value={durationHours}
                      type="number"
                      inputProps={{ min: '0.5', step: '0.5' }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12}>
            <Table aria-label="filter table" className={classes.musterTable}>
              <TableHead>
                <TableRow>
                  <TableCell>Filter Name</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {filters.length > 0 ? (filters.map(filter => (
                  <TableRow key={filter.id}>
                    <TableCell>
                      {filter.name}
                    </TableCell>
                    <TableCell className={classes.iconCell}>
                      <IconButton
                        aria-label="remove filter"
                        disabled={formDisabled}
                        onClick={() => removeFilter(filter.id)}
                      >
                        <HighlightOffIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))) : (
                  <TableRow key={-1}>
                    <TableCell>
                      Everyone
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={4}>
            <Select
              className={classes.filterSelect}
              native
              disabled={formDisabled || availableFilters.length === filters.length}
              value={selectedFilterID}
              onChange={onSelectedFilterChanged}
              inputProps={{
                name: 'filter',
                id: 'filter-select',
              }}
            >
              {availableFilters.length > filters.length ? (availableFilters.filter(filterNotAdded).map(filter => (
                <option key={filter.id} value={filter.id}>{filter.name}</option>
              ))) : (
                <option key={-1} value={-1}>All filters added</option>
              )}
            </Select>
          </Grid>
          <Grid item xs={4}>
            <Button
              size="large"
              variant="text"
              color="primary"
              disabled={formDisabled || availableFilters.length === filters.length}
              onClick={addFilter}
              startIcon={<AddCircleIcon />}
            >
              Add Selected Filter
            </Button>
          </Grid>
          {errorMessage && (
            <Grid item xs={12} className={classes.errorMessage}>
              {errorMessage}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button disabled={formDisabled} variant="outlined" onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button disabled={!canSave()} onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
  /* eslint-enable no-bitwise */
};
