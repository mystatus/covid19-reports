import { Dispatch } from 'redux';
import { ApiNotification } from '../models/api-response';
import { NotificationClient } from '../client/notification.client';

export namespace Notification {

  export namespace Actions {

    export class Fetch {
      static type = 'FETCH_NOTIFICATIONS';
      type = Fetch.type;
    }
    export class FetchSuccess {
      static type = `${Fetch.type}_SUCCESS`;
      type = FetchSuccess.type;
      constructor(public payload: {
        notifications: ApiNotification[]
      }) {}
    }
    export class FetchFailure {
      static type = `${Fetch.type}_FAILURE`;
      type = FetchFailure.type;
      constructor(public payload: {
        error: any
      }) { }
    }
  }

  export const fetch = (orgId: number) => async (dispatch: Dispatch) => {
    dispatch(new Actions.Fetch());
    try {
      const notifications = await NotificationClient.getAllNotifications(orgId);
      dispatch(new Actions.FetchSuccess({ notifications }));
    } catch (error) {
      dispatch(new Actions.FetchFailure({ error }));
    }
  };
}

