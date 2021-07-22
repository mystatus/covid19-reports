import React, { useState } from 'react';
import {
  Button, Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControlLabel,
  Grid, Paper, TextField, Typography,
} from '@material-ui/core';
import useStyles from './edit-alert-dialog.styles';
import {
  ApiNotification,
  ApiUserNotificationSetting,
} from '../../../models/api-response';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { buildSettingText } from './notifications-tab';
import { formatErrorMessage } from '../../../utility/errors';
import { NotificationClient } from '../../../client/notification.client';

export interface EditAlertDialogProps {
  open: boolean,
  orgId?: number,
  setting?: ApiUserNotificationSetting,
  notification?: ApiNotification
  onClose?: (setting?: ApiUserNotificationSetting) => void,
  onError?: (error: string) => void,
}

export const EditAlertDialog = (props: EditAlertDialogProps) => {
  const classes = useStyles();

  const [formDisabled, setFormDisabled] = useState(false);
  const {
    open, orgId, setting, notification, onClose, onError,
  } = props;

  const [threshold, setThreshold] = useState(setting!.threshold);
  const [maxDailyCount, setMaxDailyCount] = useState(setting!.maxDailyCount);
  const [minHoursBetweenAlerts, setMinHoursBetweenAlerts] = useState(setting!.minMinutesBetweenAlerts / 60);
  const [smsEnabled, setSmsEnabled] = useState(setting!.smsEnabled);
  const [emailEnabled, setEmailEnabled] = useState(setting!.emailEnabled);
  const [saveSettingLoading, setSaveSettingLoading] = useState(false);

  if (!open) {
    return <></>;
  }

  const canSave = () => {
    return !Number.isNaN(threshold)
      && !Number.isNaN(maxDailyCount)
      && !Number.isNaN(minHoursBetweenAlerts)
      && (smsEnabled || emailEnabled);
  };

  const onSave = async () => {
    setSaveSettingLoading(true);
    setFormDisabled(true);
    try {
      const updatedSetting = await NotificationClient.updateUserNotificationSetting(orgId!, setting!.id, {
        notificationId: setting!.notificationId,
        threshold,
        minMinutesBetweenAlerts: Math.round(minHoursBetweenAlerts * 60),
        maxDailyCount,
        smsEnabled,
        emailEnabled,
      });
      setSaveSettingLoading(false);
      if (onClose) {
        onClose(updatedSetting);
      }
    } catch (error) {
      if (onError) {
        onError(formatErrorMessage(error));
      }
      setFormDisabled(false);
    }
  };

  const buildSettingBlock = () => {
    if (!canSave()) {
      return (
        <Paper elevation={0} className={classes.invalidSettingBlock}>
          <div>Invalid alert settings.</div>
        </Paper>
      );
    }
    const text = buildSettingText(notification!.settingsTemplate, {
      id: setting!.id,
      notificationId: setting!.notificationId,
      threshold,
      minMinutesBetweenAlerts: minHoursBetweenAlerts * 60,
      maxDailyCount,
      smsEnabled,
      emailEnabled,
    });
    return (
      <Paper elevation={0} className={classes.settingBlock}>
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </Paper>
    );
  };

  return (
    <Dialog className={classes.root} maxWidth="xs" onClose={() => onClose?.()} open={open}>
      <DialogTitle id="alert-dialog-title">{notification!.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6} className={classes.gridLabel}>
            <Typography className={classes.label}>Alert me by:</Typography>
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={smsEnabled}
                  disabled={formDisabled}
                  onChange={(_, checked: boolean) => setSmsEnabled(checked)}
                  name="SMS Enabled"
                  color="primary"
                />
              )}
              label="SMS"
            />
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={emailEnabled}
                  disabled={formDisabled}
                  onChange={(_, checked: boolean) => setEmailEnabled(checked)}
                  name="Email Enabled"
                  color="primary"
                />
              )}
              label="Email"
            />
          </Grid>
          <Grid item xs={6} className={classes.gridLabel}>
            <Typography className={classes.label}>Threshold:</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              className={classes.textField}
              disabled={formDisabled}
              required
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setThreshold(Math.max(1, parseInt(event.target.value)))}
              value={threshold}
              type="number"
              inputProps={{ min: '1', step: '1' }}
            />
          </Grid>
          {notification!.defaultMaxDailyCount >= 0 && (
            <Grid item xs={6} className={classes.gridLabel}>
              <Typography className={classes.label}>Daily limit (or 0 for no limit):</Typography>
            </Grid>
          )}
          {notification!.defaultMaxDailyCount >= 0 && (
            <Grid item xs={6}>
              <TextField
                className={classes.textField}
                disabled={formDisabled}
                required
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMaxDailyCount(Math.max(0, parseInt(event.target.value)))}
                value={maxDailyCount}
                type="number"
                inputProps={{ min: '0', step: '1' }}
              />
            </Grid>
          )}

          {notification!.defaultMinMinutesBetweenAlerts >= 0 && (
            <Grid item xs={6} className={classes.gridLabel}>
              <Typography className={classes.label}>Minimum hours between alerts:</Typography>
            </Grid>
          )}
          {notification!.defaultMinMinutesBetweenAlerts >= 0 && (
            <Grid item xs={6}>
              <TextField
                className={classes.textField}
                disabled={formDisabled}
                required
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMinHoursBetweenAlerts(Math.max(0, parseFloat(event.target.value)))}
                value={minHoursBetweenAlerts}
                type="number"
                inputProps={{ min: '0', step: '0.5' }}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            {buildSettingBlock()}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button disabled={formDisabled} variant="outlined" onClick={() => onClose?.()} color="primary">
          Cancel
        </Button>
        <ButtonWithSpinner
          disabled={!canSave()}
          onClick={onSave}
          color="primary"
          loading={saveSettingLoading}
        >
          Save
        </ButtonWithSpinner>
      </DialogActions>
    </Dialog>
  );
};
