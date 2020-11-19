import { ApiNotification } from '../models/api-response';
import { AppState } from '../store';

export namespace NotificationSelector {
  export const all = (state: AppState): ApiNotification[] => state.notification.notifications;
}
