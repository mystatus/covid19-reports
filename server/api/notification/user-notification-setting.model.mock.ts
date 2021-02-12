import {
  uniqueDate,
  uniqueInt,
} from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { User } from '../user/user.model';
import { Notification } from './notification.model';
import { UserNotificationSetting } from './user-notification-setting.model';

export async function seedUserNotificationSetting(user: User, org: Org, notification: Notification) {
  const userNotificationSetting = UserNotificationSetting.create({
    user,
    org,
    notification,
    threshold: uniqueInt(),
    minMinutesBetweenAlerts: uniqueInt(),
    dailyCount: uniqueInt(),
    maxDailyCount: uniqueInt(),
    smsEnabled: true,
    emailEnabled: true,
    lastNotifiedDate: uniqueDate(),
  });
  return userNotificationSetting.save();
}
