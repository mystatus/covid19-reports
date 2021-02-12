import {
  uniqueInt,
  uniqueString,
} from '../../util/test-utils/unique';
import { Notification } from './notification.model';

export async function seedNotification() {
  const notification = Notification.create({
    id: uniqueString(),
    uiSort: uniqueInt(),
    uiName: uniqueString(),
    uiDescription: uniqueString(),
    uiSettingsTemplate: uniqueString(),
    smsTemplate: uniqueString(),
    emailTextTemplate: uniqueString(),
    emailHtmlTemplate: uniqueString(),
    defaultThreshold: uniqueInt(),
    defaultMaxDailyCount: uniqueInt(),
    defaultMinMinutesBetweenAlerts: uniqueInt(),
    dashboardUuid: uniqueString(),
  });
  return notification.save();
}
