import React, { useCallback, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton, Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import { Autocomplete } from '@material-ui/lab';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { UpdateOrgDefaultMusterBody } from '@covid19-reports/shared';
import { DaysOfTheWeek } from '@covid19-reports/shared/src/utils/days';
import useStyles from './default-muster-dialog.styles';
import { MusterConfiguration } from '../../../models/api-response';
import { UserSelector } from '../../../selectors/user.selector';
import MusterConfigReadable from './muster-config-readable';
import { mustersConfigurationsAreEqual, validateMusterConfiguration } from '../../../utility/muster-utils';
import { HelpCard } from '../../help/help-card/help-card';
import { UnitSelector } from '../../../selectors/unit.selector';
import { ReportSchemaSelector } from '../../../selectors/report-schema.selector';
import { formatErrorMessage } from '../../../utility/errors';
import { OrgClient } from '../../../client/org.client';

export interface DefaultMusterDialogProps {
  open: boolean,
  onClose?: (success?: boolean) => void,
  onError?: (error: string) => void,
}

interface MusterConfigurationRow extends MusterConfiguration {
  rowKey: string,
  durationHours: number,
  startTimeDate: Date,
  isOneTime: boolean,
}

type UnitValidationMap = {
  [unitName: string]: string,
};

export const DefaultMusterDialog = (props: DefaultMusterDialogProps) => {
  const classes = useStyles();
  const [formDisabled, setFormDisabled] = useState(false);
  const org = useSelector(UserSelector.org);
  const affectedUnits = useSelector(UnitSelector.all)
    .filter(unit => unit.includeDefaultConfig);
  const reports = useSelector(ReportSchemaSelector.all);
  const orgId = org?.id;
  const defaultMusterConfiguration = org?.defaultMusterConfiguration;
  const {
    open, onClose, onError,
  } = props;

  const onCancel = () => {
    if (onClose) {
      onClose(false);
    }
  };

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
        durationHours: muster.durationMinutes / 60,
        rowKey: uuidv4(),
      };
    });
  }, []);

  const [musterConfiguration, setMusterConfiguration] = useState<MusterConfigurationRow[]>(musterRows(defaultMusterConfiguration));
  const [errorMessage, setErrorMessage] = React.useState<null | string>(validateMusterConfiguration(defaultMusterConfiguration ?? []));
  const [unitValidation, setUnitValidation] = React.useState<UnitValidationMap>({});

  if (!open) {
    return null;
  }

  const hasDefaultMuster = musterConfiguration.length > 0;

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

  const setMusterTimezone = (rowKey: string) => (_: any, timezone: string) => {
    const configuration = [...musterConfiguration];
    const index = configuration.findIndex(muster => muster.rowKey === rowKey);
    if (index >= 0) {
      configuration[index].timezone = timezone;
    }
    setMusterConfiguration(configuration);
    resetErrorMessage();
  };

  const setMusterReportId = (rowKey: string) => (event: React.ChangeEvent<{ value: unknown }>) => {
    const configuration = [...musterConfiguration];
    const index = configuration.findIndex(muster => muster.rowKey === rowKey);
    if (index >= 0) {
      configuration[index].reportId = event.target.value as string;
    }
    setMusterConfiguration(configuration);
    resetErrorMessage();
  };

  const setMusterDuration = (rowKey: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = Math.max(0.5, parseFloat(event.target.value));
    if (Number.isNaN(value)) {
      value = 0.5;
    }
    const configuration = [...musterConfiguration];
    const index = configuration.findIndex(muster => muster.rowKey === rowKey);
    if (index >= 0) {
      configuration[index].durationHours = value;
      configuration[index].durationMinutes = value * 60;
    }
    setMusterConfiguration(configuration);
    resetErrorMessage();
  };

  const setMusterStartTime = (rowKey: string) => (date: MaterialUiPickersDate) => {
    if (!date) {
      return;
    }
    const configuration = [...musterConfiguration];
    const index = configuration.findIndex(muster => muster.rowKey === rowKey);
    if (index >= 0) {
      const { isOneTime } = configuration[index];
      configuration[index].startTimeDate = date.toDate();
      configuration[index].startTime = isOneTime ? date.toISOString() : date.format('HH:mm');
    }
    setMusterConfiguration(configuration);
    resetErrorMessage();
  };

  const toggleMusterDay = (rowKey: string, day: DaysOfTheWeek) => () => {
    const configuration = [...musterConfiguration];
    const index = configuration.findIndex(muster => muster.rowKey === rowKey);
    if (index >= 0) {
      // eslint-disable-next-line no-bitwise
      configuration[index].days! ^= day;
    }
    if (!configuration.some(muster => muster.days === DaysOfTheWeek.None)) {
      resetErrorMessage();
    }
    setMusterConfiguration(configuration);
  };

  const removeMusterWindow = (rowKey: string) => {
    setMusterConfiguration(previous => {
      const configuration = [...previous];
      const index = configuration.findIndex(muster => muster.rowKey === rowKey);
      if (index >= 0) {
        configuration.splice(index, 1);
      }
      return configuration;
    });
    resetErrorMessage();
  };

  const validateMusterWindows = () => {
    const validation = validateMusterConfiguration(musterConfiguration);
    if (validation) {
      setErrorMessage(validation);
      return false;
    }
    const unitsNeedingValidation = affectedUnits.filter(unit => unit.musterConfiguration.length);
    const unitErrors: UnitValidationMap = {};
    for (const unit of unitsNeedingValidation) {
      const combinedConfiguration = [...musterConfiguration, ...unit.musterConfiguration];
      const combinedValidation = validateMusterConfiguration(combinedConfiguration);
      if (combinedValidation) {
        unitErrors[unit.name] = combinedValidation;
      }
    }
    if (Object.keys(unitErrors).length) {
      setUnitValidation(unitErrors);
      setErrorMessage('The new configuration causes errors in the following units:');
      return false;
    }
    return true;
  };

  const onSave = async () => {
    if (!validateMusterWindows()) {
      return;
    }
    setFormDisabled(true);
    const body: UpdateOrgDefaultMusterBody = {
      defaultMusterConfiguration: musterConfiguration.map(muster => ({
        days: muster.days,
        startTime: muster.days ? muster.startTime : muster.startTimeDate.toISOString(),
        timezone: muster.timezone,
        durationMinutes: muster.durationMinutes,
        reportId: muster.reportId,
      })),
    };
    try {
      await OrgClient.updateOrgDefaultMuster(orgId!, body);
    } catch (error) {
      if (onError) {
        onError(formatErrorMessage(error));
      }
      setFormDisabled(false);
      return;
    }
    if (onClose) {
      onClose(true);
    }
  };

  const canSave = () => {
    return !formDisabled && !errorMessage && !mustersConfigurationsAreEqual(musterConfiguration, defaultMusterConfiguration);
  };

  const dayButtonClass = (muster: MusterConfigurationRow, day: DaysOfTheWeek) => {
    if (errorMessage && muster.days === DaysOfTheWeek.None) {
      return classes.dayButtonError;
    }
    // eslint-disable-next-line no-bitwise
    return muster.days! & day ? classes.dayButtonOn : classes.dayButtonOff;
  };

  const unitsWithErrors = affectedUnits.filter(unit => unitValidation[unit.name]);

  /* eslint-disable no-bitwise */
  return (
    <Dialog className={classes.root} maxWidth="lg" onClose={onCancel} open={open}>
      <DialogTitle id="alert-dialog-title">Default Muster Requirements</DialogTitle>
      <DialogContent>
        <HelpCard helpCardId="default-muster-dialog">
          <Typography>
            By configuring the default muster requirements you can quickly apply shared requirements across all new and existing units within a group. This setting can be overridden for the unique requirements of each unit.
          </Typography>
        </HelpCard>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              Current Requirements
            </Typography>
            <Box className={classes.atAGlance}>
              <MusterConfigReadable musterConfiguration={musterConfiguration} reports={reports} />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              Affected Units
            </Typography>

            <Box className={classes.atAGlance}>
              {affectedUnits?.length ? (
                <div className={classes.unitsContainer}>
                  {affectedUnits.map(unit => (
                    <div key={unit.id} className={clsx({ [classes.unitError]: unitValidation[unit.name] })}>
                      {unit.name}
                    </div>
                  ))}
                </div>
              ) : (
                <Typography className={classes.noUnits}>
                  None of your units use the default.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
        {hasDefaultMuster && (
          <Table aria-label="muster table" className={classes.musterTable}>
            <TableHead>
              <TableRow>
                <TableCell>Report Type</TableCell>
                <TableCell className={classes.daysColumn}>Schedule</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Time Zone</TableCell>
                <TableCell>Duration (Hrs)</TableCell>
                <TableCell className={classes.iconCell} />
              </TableRow>
            </TableHead>
            <TableBody>
              {musterConfiguration.map(muster => (
                <TableRow key={muster.rowKey}>
                  <TableCell className={classes.reportCell}>
                    <Select
                      id={`muster-report-type-${muster.rowKey}`}
                      native
                      value={muster.reportId}
                      disabled={formDisabled}
                      onChange={setMusterReportId(muster.rowKey)}
                    >
                      {reports && reports.map(report => (
                        <option key={report.id} value={report.id}>{report.name}</option>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    {muster.days !== undefined ? (
                      <div className={classes.dayButtons}>
                        <Avatar
                          className={dayButtonClass(muster, DaysOfTheWeek.Sunday)}
                          onClick={toggleMusterDay(muster.rowKey, DaysOfTheWeek.Sunday)}
                        >
                          Su
                        </Avatar>
                        <Avatar
                          className={dayButtonClass(muster, DaysOfTheWeek.Monday)}
                          onClick={toggleMusterDay(muster.rowKey, DaysOfTheWeek.Monday)}
                        >
                          Mo
                        </Avatar>
                        <Avatar
                          className={dayButtonClass(muster, DaysOfTheWeek.Tuesday)}
                          onClick={toggleMusterDay(muster.rowKey, DaysOfTheWeek.Tuesday)}
                        >
                          Tu
                        </Avatar>
                        <Avatar
                          className={dayButtonClass(muster, DaysOfTheWeek.Wednesday)}
                          onClick={toggleMusterDay(muster.rowKey, DaysOfTheWeek.Wednesday)}
                        >
                          We
                        </Avatar>
                        <Avatar
                          className={dayButtonClass(muster, DaysOfTheWeek.Thursday)}
                          onClick={toggleMusterDay(muster.rowKey, DaysOfTheWeek.Thursday)}
                        >
                          Th
                        </Avatar>
                        <Avatar
                          className={dayButtonClass(muster, DaysOfTheWeek.Friday)}
                          onClick={toggleMusterDay(muster.rowKey, DaysOfTheWeek.Friday)}
                        >
                          Fr
                        </Avatar>
                        <Avatar
                          className={dayButtonClass(muster, DaysOfTheWeek.Saturday)}
                          onClick={toggleMusterDay(muster.rowKey, DaysOfTheWeek.Saturday)}
                        >
                          Sa
                        </Avatar>
                      </div>
                    ) : (
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                          id={`muster-date-time-${muster.rowKey}`}
                          disabled={formDisabled}
                          format="MMMM D, yyyy"
                          value={muster.startTimeDate}
                          InputProps={{ disableUnderline: true }}
                          onChange={setMusterStartTime(muster.rowKey)}
                        />
                      </MuiPickersUtilsProvider>
                    )}
                  </TableCell>
                  <TableCell>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <TimePicker
                        id={`muster-start-time-${muster.rowKey}`}
                        disabled={formDisabled}
                        value={muster.startTimeDate}
                        InputProps={{ disableUnderline: true }}
                        onChange={setMusterStartTime(muster.rowKey)}
                      />
                    </MuiPickersUtilsProvider>
                  </TableCell>
                  <TableCell className={classes.timeZoneCell}>
                    <Autocomplete
                      id={`muster-timezone-${muster.rowKey}`}
                      value={muster.timezone}
                      disabled={formDisabled}
                      disableClearable
                      options={moment.tz.names()}
                      noOptionsText="No matching time zones"
                      renderInput={params => (
                        <TextField {...params} InputProps={{ ...params.InputProps, disableUnderline: true }} />
                      )}
                      onChange={setMusterTimezone(muster.rowKey)}
                    />
                  </TableCell>
                  <TableCell className={classes.durationCell}>
                    <TextField
                      disabled={formDisabled}
                      onChange={setMusterDuration(muster.rowKey)}
                      value={muster.durationHours}
                      type="number"
                      inputProps={{ min: '0.5', step: '0.5' }}
                    />
                  </TableCell>
                  <TableCell className={classes.iconCell}>
                    <IconButton
                      aria-label="remove muster window"
                      onClick={() => removeMusterWindow(muster.rowKey)}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {errorMessage && (
          <Grid item xs={12} className={classes.errorMessage}>
            {errorMessage}
            {unitsWithErrors.length > 0 && (
              <ul>
                {unitsWithErrors.map(unit => (
                  <li key={unit.name}>
                    <strong>{unit.name}: </strong>{unitValidation[unit.name]}
                  </li>
                ))}
              </ul>
            )}
          </Grid>
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
      </DialogContent>
      <DialogActions>
        <Button disabled={formDisabled} variant="outlined" onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button disabled={!canSave()} onClick={onSave} color="primary">
          Save &amp; Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
  /* eslint-enable no-bitwise */
};
