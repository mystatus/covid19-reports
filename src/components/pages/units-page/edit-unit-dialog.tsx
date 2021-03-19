import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import axios from 'axios';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import { Autocomplete } from '@material-ui/lab';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useSelector } from 'react-redux';
import useStyles from './edit-unit-dialog.styles';
import { ApiUnit, MusterConfiguration } from '../../../models/api-response';
import { DaysOfTheWeek } from '../../../utility/days';
import { formatMessage } from '../../../utility/errors';
import { ReportSchemaSelector } from '../../../selectors/report-schema.selector';
import { mustersConfigurationsAreEqual, validateMusterConfiguration } from '../../../utility/muster-utils';

export interface EditUnitDialogProps {
  open: boolean;
  orgId?: number;
  unit?: ApiUnit;
  defaultMusterConfiguration: MusterConfiguration[];
  onClose?: () => void;
  onError?: (error: string) => void;
}

interface MusterConfigurationRow extends MusterConfiguration {
  rowKey: string;
  durationHours: number;
  startTimeDate: Date;
  isOneTime: boolean;
}

export const EditUnitDialog = (props: EditUnitDialogProps) => {
  const { defaultMusterConfiguration, open, orgId, unit, onClose, onError } = props;
  const classes = useStyles();
  const reports = useSelector(ReportSchemaSelector.all);
  const [formDisabled, setFormDisabled] = useState(false);
  const existingUnit: boolean = !!unit;
  const [name, setName] = useState(unit?.name || '');
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null);
  const [includeDefault, setIncludeDefault] = useState(!unit || unit.includeDefaultConfig);

  const musterRows = useCallback((musterConfiguration?: MusterConfiguration[]) => {
    const today = moment().format('Y-M-D');
    return (musterConfiguration ?? []).map(muster => {
      const isOneTime = (muster as MusterConfigurationRow)?.isOneTime ?? !muster.days;
      const startTimeDate = isOneTime
        ? moment(muster.startTime).toDate()
        : moment(`${today} ${muster.startTime}`, 'Y-M-D HH:mm').toDate();
      return {
        ...muster,
        startTime: isOneTime ? startTimeDate.toISOString() : muster.startTime,
        isOneTime,
        startTimeDate,
        rowKey: uuidv4(),
        durationHours: muster.durationMinutes / 60,
      };
    });
  }, []);

  const [musterConfiguration, setMusterConfiguration] = useState<MusterConfigurationRow[]>(
    musterRows(unit?.musterConfiguration)!,
  );

  const [combinedConfiguration, setCombinedConfiguration] = useState<MusterConfigurationRow[]>([]);

  useEffect(() => {
    const defaultOrEmpty = includeDefault ? defaultMusterConfiguration : [];
    const combined = musterRows(defaultOrEmpty).concat(musterConfiguration.map(t => ({ ...t })));
    setCombinedConfiguration(combined);
  }, [defaultMusterConfiguration, includeDefault, unit, musterConfiguration, musterRows]);

  if (!open) {
    return null;
  }

  const onInputChanged = (func: (f: string) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.value);
  };

  const resetErrorMessage = () => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const addMusterWindow = (recurring: boolean) => {
    if (reports == null || reports.length === 0) {
      setErrorMessage('No report types have been added to this group.');
      return;
    }
    const start = moment(`${moment().format('Y-M-D')} 00:00`, 'Y-M-D HH:mm');
    const row = {
      startTime: recurring ? start.format('HH:mm') : start.toISOString(),
      timezone: moment.tz.guess(),
      durationMinutes: 120,
      durationHours: 2,
      reportId: reports[0].id,
      rowKey: uuidv4(),
      startTimeDate: start.toDate(),
      isOneTime: !recurring,
    } as MusterConfigurationRow;

    if (recurring) {
      row.days = DaysOfTheWeek.None;
    }

    setMusterConfiguration([...musterConfiguration, row]);
    resetErrorMessage();
  };

  const combinedToMusterAdjust = includeDefault ? defaultMusterConfiguration.length : 0;

  const updateState = (index: number, partial: Partial<MusterConfigurationRow>) => {
    const adjustedIndex = index - combinedToMusterAdjust;
    musterConfiguration[adjustedIndex] = {
      ...musterConfiguration[adjustedIndex],
      ...partial,
    };
    setMusterConfiguration([...musterConfiguration]);
    resetErrorMessage();
  };

  const setMusterTimezone = (index: number) => (_: any, timezone: string) => {
    updateState(index, { timezone });
  };

  const setMusterReportId = (index: number) => (event: React.ChangeEvent<{ value: unknown }>) => {
    updateState(index, {
      reportId: event.target.value as string,
    });
  };

  const setMusterDuration = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = Math.max(0.5, parseFloat(event.target.value));
    if (Number.isNaN(value)) {
      value = 0.5;
    }
    updateState(index, {
      durationHours: value,
      durationMinutes: value * 60,
    });
  };

  const setMusterStartTime = (index: number) => (date: MaterialUiPickersDate) => {
    if (!date) {
      return;
    }
    const { isOneTime } = musterConfiguration[index - combinedToMusterAdjust];
    updateState(index, {
      startTimeDate: date.toDate(),
      startTime: isOneTime ? date.toISOString() : date.format('HH:mm'),
    });
  };

  const toggleMusterDay = (index: number, day: DaysOfTheWeek) => () => {
    if (formDisabled || isDefault(index)) {
      return;
    }
    updateState(index, {
      // eslint-disable-next-line no-bitwise
      days: musterConfiguration[index - combinedToMusterAdjust].days! ^ day,
    });
  };

  const removeMusterWindow = (index: number) => {
    setMusterConfiguration(musterConfiguration.filter((_, i) => i !== index - combinedToMusterAdjust));
    resetErrorMessage();
  };

  const validateMusterWindows = () => {
    const validation = validateMusterConfiguration(combinedConfiguration);
    if (validation) {
      setErrorMessage(validation);
      return false;
    }
    return true;
  };

  const onSave = async () => {
    if (!validateMusterWindows()) {
      return;
    }
    setFormDisabled(true);
    const body = {
      id: unit?.id,
      name,
      musterConfiguration: musterConfiguration.map(muster => ({
        days: muster.days,
        startTime: muster.days ? muster.startTime : muster.startTimeDate,
        timezone: muster.timezone,
        durationMinutes: muster.durationMinutes,
        reportId: muster.reportId,
      })),
      includeDefaultConfig: includeDefault,
    };
    try {
      if (existingUnit) {
        await axios.put(`api/unit/${orgId}/${unit!.id}`, body);
      } else {
        await axios.post(`api/unit/${orgId}`, body);
      }
    } catch (error) {
      if (onError) {
        onError(formatMessage(error));
      }
      setFormDisabled(false);
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  const canSave = () => {
    const isValid = !formDisabled && name.length > 0 && !errorMessage;
    if (!isValid) {
      return false;
    }
    const hasChanges = name !== unit?.name
      || includeDefault !== unit?.includeDefaultConfig
      || !mustersConfigurationsAreEqual(musterConfiguration, unit.musterConfiguration);
    return hasChanges;
  };

  const isDefault = (index: number) => includeDefault && index < defaultMusterConfiguration.length;

  const dayButtonClass = (muster: MusterConfigurationRow, index: number, day: DaysOfTheWeek) => {
    if (errorMessage && muster.days === DaysOfTheWeek.None) {
      return classes.dayButtonError;
    }
    // eslint-disable-next-line no-bitwise
    const onOffClass = (muster.days ?? 0) & day ? classes.dayButtonOn : classes.dayButtonOff;

    return clsx(onOffClass, {
      [classes.dayButtonDisabled]: isDefault(index),
    });
  };

  /* eslint-disable no-bitwise */
  return (
    <Dialog className={classes.root} maxWidth="lg" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingUnit ? 'Edit Unit' : 'New Unit'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography className={classes.headerLabel}>Name</Typography>
            <TextField
              className={classes.textField}
              id="unit-name"
              disabled={formDisabled}
              value={name}
              onChange={onInputChanged(setName)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.headerLabel}>Muster Configuration</Typography>
            <div>
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={includeDefault}
                    disabled={formDisabled}
                    onChange={(_, checked: boolean) => setIncludeDefault(checked)}
                    color="primary"
                  />
                )}
                label="Include Default"
              />
            </div>
            {/* {showNoneMessage && (
              <p>
                This unit is not required to muster.
                {musterConfigMode === MusterConfigMode.Default && (
                  <em> (using default muster requirements)</em>
                )}
              </p>
            )} */}
            {combinedConfiguration.length > 0 && (
              <Table aria-label="muster table" className={classes.musterTable}>
                <TableHead>
                  <TableRow>
                    <TableCell>Report Type</TableCell>
                    <TableCell className={classes.daysColumn}>Repeating Days / One-Time Date</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>Time Zone</TableCell>
                    <TableCell>Duration (Hrs)</TableCell>
                    <TableCell className={classes.iconCell} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {combinedConfiguration.map((muster, index) => (
                    <TableRow key={muster.rowKey}>
                      <TableCell className={classes.reportCell}>
                        <Select
                          id={`muster-report-type-${muster.rowKey}`}
                          native
                          value={muster.reportId}
                          disabled={formDisabled || isDefault(index)}
                          onChange={setMusterReportId(index)}
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
                        {muster.days !== undefined ? (
                          <div className={classes.dayButtons}>
                            <Avatar
                              className={dayButtonClass(muster, index, DaysOfTheWeek.Sunday)}
                              onClick={toggleMusterDay(index, DaysOfTheWeek.Sunday)}
                            >
                              Su
                            </Avatar>
                            <Avatar
                              className={dayButtonClass(muster, index, DaysOfTheWeek.Monday)}
                              onClick={toggleMusterDay(index, DaysOfTheWeek.Monday)}
                            >
                              Mo
                            </Avatar>
                            <Avatar
                              className={dayButtonClass(muster, index, DaysOfTheWeek.Tuesday)}
                              onClick={toggleMusterDay(index, DaysOfTheWeek.Tuesday)}
                            >
                              Tu
                            </Avatar>
                            <Avatar
                              className={dayButtonClass(muster, index, DaysOfTheWeek.Wednesday)}
                              onClick={toggleMusterDay(index, DaysOfTheWeek.Wednesday)}
                            >
                              We
                            </Avatar>
                            <Avatar
                              className={dayButtonClass(muster, index, DaysOfTheWeek.Thursday)}
                              onClick={toggleMusterDay(index, DaysOfTheWeek.Thursday)}
                            >
                              Th
                            </Avatar>
                            <Avatar
                              className={dayButtonClass(muster, index, DaysOfTheWeek.Friday)}
                              onClick={toggleMusterDay(index, DaysOfTheWeek.Friday)}
                            >
                              Fr
                            </Avatar>
                            <Avatar
                              className={dayButtonClass(muster, index, DaysOfTheWeek.Saturday)}
                              onClick={toggleMusterDay(index, DaysOfTheWeek.Saturday)}
                            >
                              Sa
                            </Avatar>
                          </div>
                        ) : (
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                              id={`muster-date-time-${muster.rowKey}`}
                              disabled={formDisabled || isDefault(index)}
                              value={muster.startTimeDate}
                              InputProps={{ disableUnderline: true }}
                              onChange={setMusterStartTime(index)}
                            />
                          </MuiPickersUtilsProvider>
                        )}
                      </TableCell>
                      <TableCell>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <TimePicker
                            id={`muster-start-time-${muster.rowKey}`}
                            disabled={formDisabled || isDefault(index)}
                            value={muster.startTimeDate}
                            InputProps={{ disableUnderline: true }}
                            onChange={setMusterStartTime(index)}
                          />
                        </MuiPickersUtilsProvider>
                      </TableCell>
                      <TableCell className={classes.timeZoneCell}>
                        <Autocomplete
                          id={`muster-timezone-${muster.rowKey}`}
                          value={muster.timezone}
                          disabled={formDisabled || isDefault(index)}
                          disableClearable
                          options={moment.tz.names()}
                          noOptionsText="No matching time zones"
                          renderInput={params => (
                            <TextField {...params} InputProps={{ ...params.InputProps, disableUnderline: true }} />
                          )}
                          onChange={setMusterTimezone(index)}
                        />
                      </TableCell>
                      <TableCell className={classes.durationCell}>
                        <TextField
                          disabled={formDisabled || isDefault(index)}
                          onChange={setMusterDuration(index)}
                          value={muster.durationHours}
                          type="number"
                          inputProps={{ min: '0.5', step: '0.5' }}
                        />
                      </TableCell>
                      <TableCell className={classes.iconCell}>
                        {!isDefault(index) && (
                          <IconButton
                            aria-label="remove muster window"
                            disabled={formDisabled || isDefault(index)}
                            onClick={() => removeMusterWindow(index)}
                          >
                            <HighlightOffIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Button
              className={classes.addMusterButton}
              color="primary"
              variant="text"
              size="small"
              startIcon={<AddCircleIcon />}
              onClick={() => addMusterWindow(true)}
            >
              Add Repeating
            </Button>
            <Button
              className={classes.addMusterButton}
              color="primary"
              variant="text"
              size="small"
              startIcon={<AddCircleIcon />}
              onClick={() => addMusterWindow(false)}
            >
              Add One-Time
            </Button>
          </Grid>
          {errorMessage && (
            <Grid item xs={12} className={classes.errorMessage}>
              {errorMessage}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
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
