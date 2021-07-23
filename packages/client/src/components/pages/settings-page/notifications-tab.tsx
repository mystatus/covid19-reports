import React, {
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Divider,
  IconButton,
  Paper,
  Switch,
  Table,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import {
  ApiNotification,
  ApiUserNotificationSetting,
} from '../../../models/api-response';
import useStyles from './notifications-tab.style';
import { TabPanelProps } from './settings-page';
import {
  EditAlertDialog,
  EditAlertDialogProps,
} from './edit-alert-dialog';
import { Modal } from '../../../actions/modal.actions';
import { formatErrorMessage } from '../../../utility/errors';
import { UserSelector } from '../../../selectors/user.selector';
import { NotificationClient } from '../../../client/notification.client';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';

interface NotificationSettings {
  [key: string]: ApiUserNotificationSetting,
}

interface NotificationSaving {
  [key: string]: boolean,
}

export const NotificationsTab = (props: TabPanelProps) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const {
    value, index, ...other
  } = props;

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({});
  const [notificationSaving, setNotificationSaving] = useState<NotificationSaving>({});
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [editAlertDialogProps, setEditAlertDialogProps] = useState<EditAlertDialogProps>({ open: false });

  const orgId = useAppSelector(UserSelector.orgId)!;

  const initializeTable = React.useCallback(async () => {
    const availableNotifications = await NotificationClient.getAvailableNotifications(orgId);
    const userNotificationSettings = await NotificationClient.getUserNotificationSettings(orgId);
    const settings: NotificationSettings = {};
    userNotificationSettings.forEach(setting => {
      settings[setting.notificationId] = setting;
    });
    const saving: NotificationSaving = {};
    availableNotifications.forEach(notification => {
      saving[notification.id] = false;
    });
    setNotifications(availableNotifications);
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
        dispatch(Modal.alert('Edit Alert', `Unable to edit alert settings: ${message}`));
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
        const newSetting = await NotificationClient.addUserNotificationSetting(orgId, {
          notificationId: notification.id,
          threshold: notification.defaultThreshold,
          minMinutesBetweenAlerts: notification.defaultMinMinutesBetweenAlerts,
          maxDailyCount: notification.defaultMaxDailyCount,
          smsEnabled: false,
          emailEnabled: true,
        });
        setNotificationSettings(prevState => {
          const newState = { ...prevState };
          newState[notification.id] = newSetting;
          return newState;
        });
      } else {
        const setting = notificationSettings[notification.id];
        setNotificationSettings(prevState => {
          const newState = { ...prevState };
          delete newState[notification.id];
          return newState;
        });
        await NotificationClient.deleteUserNotificationSetting(orgId, setting.id);
      }
      setNotificationSaving(prevState => {
        const newState = { ...prevState };
        newState[notification.id] = false;
        return newState;
      });
    } catch (error) {
      dispatch(Modal.alert('Error', formatErrorMessage(error, 'An error occurred while saving the alert setting'))).then();
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
    dispatch(Modal.alert('Alerts',
      `Alerts within the StatusEngine application have been designed to give you the most up-to-date
      information on your group and users without overburdening your inbox or mobile device. Each alert topic
      has customizable parameters that allow you to tweak the alert type, threshold, frequency, and minimum
      time between individual alerts.`)).then();
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
