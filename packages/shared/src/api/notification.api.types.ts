export type UserNotificationSettingBody = {
  notificationId?: string;
  threshold?: number;
  minMinutesBetweenAlerts?: number;
  dailyCount?: number;
  maxDailyCount?: number;
  smsEnabled?: boolean;
  emailEnabled?: boolean;
  lastNotifiedDate?: number;
};

export type UpdateUserNotificationSettingBody = UserNotificationSettingBody;

export type AddUserNotificationSettingBody = UserNotificationSettingBody;
