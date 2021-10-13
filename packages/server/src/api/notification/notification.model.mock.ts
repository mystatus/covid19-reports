import {
  uniqueInt,
  uniqueString,
} from '../../util/test-utils/unique';
import { Notification } from './notification.model';

export function mockNotification() {
  return Notification.create({
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
  });
}

export function seedNotification() {
  return mockNotification().save();
}
