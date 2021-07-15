import { Notification } from '../actions/notification.actions';
import { User } from '../actions/user.actions';
import { ApiNotification } from '../models/api-response';

export interface NotificationState {
  notifications: ApiNotification[],
  isLoading: boolean
  lastUpdated: number
}

export const notificationInitialState: NotificationState = {
  notifications: [],
  isLoading: false,
  lastUpdated: 0,
};

export function notificationReducer(state = notificationInitialState, action: any) {
  switch (action.type) {
    case User.Actions.ChangeOrg.type:
      return notificationInitialState;
    case Notification.Actions.Fetch.type: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case Notification.Actions.FetchSuccess.type: {
      const payload = (action as Notification.Actions.FetchSuccess).payload;
      return {
        ...state,
        notifications: payload.notifications,
        isLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case Notification.Actions.FetchFailure.type: {
      return {
        ...state,
        notifications: [],
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
