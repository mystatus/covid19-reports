import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Button, Divider, IconButton, Paper, Switch, Table, TableCell, TableRow, Typography,
} from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import { ApiNotification, ApiUserNotificationSetting } from '../../../models/api-response';
import useStyles from './notifications-tab.style';
import { AppState } from '../../../store';
import { UserState } from '../../../reducers/user.reducer';
import { TabPanelProps } from './settings-page';
import { EditAlertDialog, EditAlertDialogProps } from './edit-alert-dialog';

interface NotificationSettings {
  [key: string]: ApiUserNotificationSetting,
}

interface NotificationSaving {
  [key: string]: boolean,
}

export const NotificationsTab = (props: TabPanelProps) => {
  const classes = useStyles();
  const {
    value, index, setAlertDialogProps, ...other
  } = props;

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({});
  const [notificationSaving, setNotificationSaving] = useState<NotificationSaving>({});
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [editAlertDialogProps, setEditAlertDialogProps] = useState<EditAlertDialogProps>({ open: false });

  const orgId = useSelector<AppState, UserState>(state => state.user).activeRole?.org?.id;

  const initializeTable = React.useCallback(async () => {
    const notificationsResponse = (await axios.get(`api/notification/${orgId}`)).data as ApiNotification[];
    const settingsResponse = (await axios.get(`api/notification/${orgId}/setting`)).data as ApiUserNotificationSetting[];
    const settings: NotificationSettings = {};
    settingsResponse.forEach(setting => {
      settings[setting.notificationId] = setting;
    });
    const saving: NotificationSaving = {};
    notificationsResponse.forEach(notification => {
      saving[notification.id] = false;
    });
    setNotifications(notificationsResponse);
    setNotificationSettings(settings);
    setNotificationSaving(saving);
  }, [orgId]);

  const editAlertClicked = async (setting: ApiUserNotificationSetting) => {
    setEditAlertDialogProps({
      open: true,
      orgId,
      setting,
      notification: notifications.find(notification => notification.id === setting.notificationId),
      onClose: async (newSetting?: ApiUserNotificationSetting) => {
        if (newSetting) {
          setNotificationSettings(previous => {
            const newState = { ...previous };
            newState[newSetting.notificationId] = newSetting;
            return newState;
          });
        }
        setEditAlertDialogProps({ open: false });
      },
      onError: (message: string) => {
        setAlertDialogProps({
          open: true,
          title: 'Edit Alert',
          message: `Unable to edit alert settings: ${message}`,
          onClose: () => { setAlertDialogProps({ open: false }); },
        });
      },
    });
  };

  const toggleSetting = (notification: ApiNotification) => async (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (notificationSaving[notification.id]) {
      return;
    }
    try {
      setNotificationSaving(prevState => {
        const newState = { ...prevState };
        newState[notification.id] = true;
        return newState;
      });
      if (checked) {
        const newSetting: ApiUserNotificationSetting = {
          id: -1,
          notificationId: notification.id,
          threshold: notification.defaultThreshold,
          minMinutesBetweenAlerts: notification.defaultMinMinutesBetweenAlerts,
          maxDailyCount: notification.defaultMaxDailyCount,
          smsEnabled: false,
          emailEnabled: true,
        };
        setNotificationSettings(prevState => {
          const newState = { ...prevState };
          newState[notification.id] = newSetting;
          return newState;
        });
        const response = (await axios.post(`api/notification/${orgId}/setting`, newSetting)).data as ApiUserNotificationSetting;
        newSetting.id = response.id;
      } else {
        const setting = notificationSettings[notification.id];
        setNotificationSettings(prevState => {
          const newState = { ...prevState };
          delete newState[notification.id];
          return newState;
        });
        await axios.delete(`api/notification/${orgId}/setting/${setting.id}`);
      }
      setNotificationSaving(prevState => {
        const newState = { ...prevState };
        newState[notification.id] = false;
        return newState;
      });
    } catch (error) {
      let message = 'Internal Server Error';
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        message = error.response.data.errors[0].message;
      }
      setAlertDialogProps({
        open: true,
        title: 'Error',
        message: `An error occurred while saving the alert setting: ${message}`,
        onClose: () => { setAlertDialogProps({ open: false }); },
      });
      await initializeTable();
    }
  };

  const buildSettingCell = (template: string, setting?: ApiUserNotificationSetting) => {
    if (!setting) {
      return <></>;
    }
    const text = buildSettingText(template, setting);
    return (
      <Paper elevation={0}>
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: text }} />
        <Button
          size="small"
          variant="text"
          className={classes.changeAlertButton}
          onClick={async () => editAlertClicked(setting)}
        >
          Change
        </Button>
      </Paper>
    );
  };

  const displayInfo = () => {
    setAlertDialogProps({
      open: true,
      title: 'Alerts',
      message: `Alerts within the StatusEngine application have been designed to give you the most up-to-date
      information on your group and users without overburdening your inbox or mobile device. Each alert topic
      has customizable parameters that allow you to tweak the alert type, threshold, frequency, and minimum
      time between individual alerts.`,
      onClose: () => { setAlertDialogProps({ open: false }); },
    });
  };

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
      className={classes.root}
    >
      {value === index && (
        <Paper elevation={3}>
          <h2 className={classes.alertsHeader}>
            Alerts
            <IconButton className={classes.infoIcon} aria-label="Alert Info" size="small" onClick={displayInfo}>
              <HelpOutline fontSize="inherit" />
            </IconButton>
          </h2>

          {notifications.length > 0 && (
            <Table aria-label="Alerts" className={classes.alertsTable}>
              {notifications.map(notification => (
                <TableRow key={notification.id}>
                  <TableCell className={classes.alertSwitchCell}>
                    <Switch
                      checked={Boolean(notificationSettings[notification.id])}
                      onChange={toggleSetting(notification)}
                      name={notification.id}
                      color="primary"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      className={notificationSettings[notification.id] ? classes.alertSwitchActivated : classes.alertSwitchDeactivated}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography className={classes.alertName}>{notification.name}</Typography>
                    <Typography>{notification.description}</Typography>
                  </TableCell>
                  <TableCell className={classes.alertSettingCell}>
                    {buildSettingCell(notification.settingsTemplate, notificationSettings[notification.id])}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          )}
          {notifications.length === 0 && (
            <>
              <Divider />
              <Typography className={classes.noAlerts}>No alerts are available for this group.</Typography>
            </>
          )}

        </Paper>
      )}
      {editAlertDialogProps.open && (
        <EditAlertDialog
          open={editAlertDialogProps.open}
          orgId={orgId}
          setting={editAlertDialogProps.setting}
          notification={editAlertDialogProps.notification}
          onClose={editAlertDialogProps.onClose}
          onError={editAlertDialogProps.onError}
        />
      )}
    </div>
  );
};

export const buildSettingText = (template: string, setting: ApiUserNotificationSetting) => {
  let frequency: string;
  if (setting.maxDailyCount <= 0) {
    if (setting.minMinutesBetweenAlerts > 0) {
      frequency = `Do not alert me more than once every <b>${setting.minMinutesBetweenAlerts / 60}</b> hour(s).`;
    } else {
      frequency = '';
    }
  } else if (setting.minMinutesBetweenAlerts > 0) {
    frequency = `Do not alert me more than <b>${setting.maxDailyCount}</b> time(s) per day with a minimum of <b>${setting.minMinutesBetweenAlerts / 60}</b> hour(s) between alerts.`;
  } else {
    frequency = `Do not alert me more than <b>${setting.maxDailyCount}</b> time(s) per day.`;
  }
  const type = setting.smsEnabled ? (setting.emailEnabled ? 'text and email' : 'text') : (setting.emailEnabled ? 'email' : 'nothing');
  const settingText = template
    .replace(/{type}/g, `<b>${type}</b>`)
    .replace(/{threshold}/g, `<b>${setting.threshold}</b>`);
  return `${settingText} ${frequency}`;
};
