import {
  AddUserNotificationSettingBody,
  UpdateUserNotificationSettingBody,
} from '@covid19-reports/shared';
import {
  ApiNotification,
  ApiUserNotificationSetting,
} from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('notification');

export class NotificationClient {

  static getAvailableNotifications(orgId: number): Promise<ApiNotification[]> {
    return client.get(`${orgId}`);
  }

  static getAllNotifications(orgId: number): Promise<ApiNotification[]> {
    return client.get(`${orgId}/all`);
  }

  static getUserNotificationSettings(orgId: number): Promise<ApiUserNotificationSetting[]> {
    return client.get(`${orgId}/setting`);
  }

  static addUserNotificationSetting(orgId: number, body: AddUserNotificationSettingBody): Promise<ApiUserNotificationSetting> {
    return client.post(`${orgId}/setting`, body);
  }

  static deleteUserNotificationSetting(orgId: number, settingId: number): Promise<ApiUserNotificationSetting> {
    return client.delete(`${orgId}/setting/${settingId}`);
  }

  static updateUserNotificationSetting(orgId: number, settingId: number, body: UpdateUserNotificationSettingBody): Promise<ApiUserNotificationSetting> {
    return client.put(`${orgId}/setting/${settingId}`, body);
  }

}
