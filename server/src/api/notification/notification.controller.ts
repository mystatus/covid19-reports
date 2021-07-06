import { Response } from 'express';
import {
  ApiRequest, OrgParam, OrgSettingParams,
} from '../api.router';
import { Notification } from './notification.model';
import { BadRequestError, NotFoundError } from '../../util/error-types';
import { UserNotificationSetting } from './user-notification-setting.model';

class NotificationController {

  async getAllNotifications(req: ApiRequest, res: Response) {
    const notifications = await Notification.find({
      order: {
        uiSort: 'ASC',
      },
    });

    res.json(notifications.map(sanitizeNotification));
  }

  async getAvailableNotifications(req: ApiRequest, res: Response) {
    const notifications = await Notification.find({
      order: {
        uiSort: 'ASC',
      },
    });

    const role = req.appUserRole!.role;
    const all = role.allowedNotificationEvents.length === 1
      && role.allowedNotificationEvents[0] === '*';
    const available = all ? notifications : notifications.filter(notification => {
      return role.allowedNotificationEvents.indexOf(notification.id) >= 0;
    });

    res.json(available.map(sanitizeNotification));
  }

  async getUserNotificationSettings(req: ApiRequest, res: Response) {
    const settings = await UserNotificationSetting.find({
      relations: ['notification'],
      where: {
        org: req.appOrg!.id,
        user: req.appUser.edipi,
      },
    });

    res.json(settings.map(sanitizeUserNotificationSetting));
  }

  async addUserNotificationSetting(req: ApiRequest<OrgParam, UserNotificationSettingBody>, res: Response) {
    if (!req.body.notificationId) {
      throw new BadRequestError('A notification id must be supplied when adding a workspace.');
    }

    const notification = await Notification.findOne({
      where: {
        id: req.body.notificationId,
      },
    });

    if (!notification) {
      throw new NotFoundError(`Notification could not be found: ${req.body.notificationId}`);
    }

    const existingSetting = await UserNotificationSetting.findOne({
      where: {
        org: req.appOrg!.id,
        user: req.appUser.edipi,
        notification: notification.id,
      },
    });

    if (existingSetting) {
      throw new BadRequestError('There is already a user setting for the notification.');
    }

    const setting = new UserNotificationSetting();
    setting.org = req.appOrg;
    setting.user = req.appUser;
    setting.notification = notification;

    await setNotificationSettingFromBody(setting, req.body);

    const newSetting = await setting.save();

    await res.status(201).json(sanitizeUserNotificationSetting(newSetting));
  }

  async getUserNotificationSetting(req: ApiRequest<OrgSettingParams>, res: Response) {
    const settingId = parseInt(req.params.settingId);

    const setting = await UserNotificationSetting.findOne({
      relations: ['notification'],
      where: {
        id: settingId,
        org: req.appOrg!.id,
        user: req.appUser.edipi,
      },
    });

    if (!setting) {
      throw new NotFoundError('Notification setting could not be found.');
    }

    res.json(sanitizeUserNotificationSetting(setting));
  }

  async deleteUserNotificationSetting(req: ApiRequest<OrgSettingParams>, res: Response) {
    const settingId = parseInt(req.params.settingId);

    const setting = await UserNotificationSetting.findOne({
      where: {
        id: settingId,
        org: req.appOrg!.id,
        user: req.appUser.edipi,
      },
    });

    if (!setting) {
      throw new NotFoundError('Notification setting could not be found.');
    }

    const removedSetting = await setting.remove();
    res.json(sanitizeUserNotificationSetting(removedSetting));
  }

  async updateUserNotificationSetting(req: ApiRequest<OrgSettingParams, UserNotificationSettingBody>, res: Response) {
    const settingId = parseInt(req.params.settingId);

    const setting = await UserNotificationSetting.findOne({
      relations: ['user', 'org', 'notification'],
      where: {
        id: settingId,
        org: req.appOrg!.id,
        user: req.appUser.edipi,
      },
    });

    if (!setting) {
      throw new NotFoundError('Notification setting could not be found.');
    }

    await setNotificationSettingFromBody(setting, req.body);

    const updatedSetting = await setting.save();

    res.json(sanitizeUserNotificationSetting(updatedSetting));
  }
}

// Remove message templates and other information that doesn't need to be sent to the client
function sanitizeNotification(notification?: Notification) {
  if (!notification) {
    return undefined;
  }
  return {
    id: notification.id,
    name: notification.uiName,
    description: notification.uiDescription,
    settingsTemplate: notification.uiSettingsTemplate,
    defaultThreshold: notification.defaultThreshold,
    defaultMinMinutesBetweenAlerts: notification.defaultMinMinutesBetweenAlerts,
    defaultMaxDailyCount: notification.defaultMaxDailyCount,
  };
}

// Remove extra information that doesn't need to be sent to the client
function sanitizeUserNotificationSetting(setting: UserNotificationSetting) {
  return {
    id: setting.id,
    notificationId: setting.notification?.id,
    threshold: setting.threshold,
    minMinutesBetweenAlerts: setting.minMinutesBetweenAlerts,
    maxDailyCount: setting.maxDailyCount,
    smsEnabled: setting.smsEnabled,
    emailEnabled: setting.emailEnabled,
  };
}

async function setNotificationSettingFromBody(setting: UserNotificationSetting, body: UserNotificationSettingBody) {
  if (body.threshold != null) {
    setting.threshold = body.threshold;
  }
  if (body.minMinutesBetweenAlerts != null) {
    setting.minMinutesBetweenAlerts = body.minMinutesBetweenAlerts;
  }
  if (body.dailyCount != null) {
    setting.dailyCount = body.dailyCount;
  }
  if (body.maxDailyCount != null) {
    setting.maxDailyCount = body.maxDailyCount;
  }
  if (body.smsEnabled != null) {
    setting.smsEnabled = body.smsEnabled;
  }
  if (body.emailEnabled != null) {
    setting.emailEnabled = body.emailEnabled;
  }
  if (body.lastNotifiedDate != null) {
    setting.lastNotifiedDate = new Date(body.lastNotifiedDate);
  }
}

type UserNotificationSettingBody = {
  notificationId?: string,
  threshold?: number,
  minMinutesBetweenAlerts?: number,
  dailyCount?: number,
  maxDailyCount?: number,
  smsEnabled?: boolean,
  emailEnabled?: boolean,
  lastNotifiedDate?: number,
};

export default new NotificationController();
