import { Dispatch } from 'redux';
import { AppState } from '../store';
import { ApiRosterColumnInfo } from '../models/api-response';
import { RosterClient } from '../client';
import { formatMessage } from '../utility/errors';

export namespace Roster {

  export namespace Actions {

    export class Upload {
      static type = 'ROSTER_UPLOAD';
      type = Upload.type;
    }


    export class FetchColumns {
      static type = 'FETCH_ROSTER_COLUMNS';
      type = FetchColumns.type;
    }

    export class FetchColumnsSuccess {
      static type = `${FetchColumns.type}_SUCCESS`;
      type = FetchColumnsSuccess.type;
      constructor(public payload: {
        columns: ApiRosterColumnInfo[]
      }) {}
    }
    export class FetchColumnsFailure {
      static type = `${FetchColumns.type}_FAILURE`;
      type = FetchColumnsFailure.type;
      constructor(public payload: {
        error: any
      }) { }
    }

    export class DeleteAll {
      static type = 'ROSTER_DELETE_ALL';
      type = DeleteAll.type;
    }

    export class DeleteAllSuccess {
      static type = `${DeleteAll.type}_SUCCESS`;
      type = DeleteAllSuccess.type;
    }

    export class DeleteAllFailure {
      static type = `${DeleteAll.type}_FAILURE`;
      type = DeleteAllFailure.type;
      constructor(public payload: {
        error: any
      }) { }
    }
  }

  export const upload = (file: File, onComplete: (response: RosterClient.UploadResponse, message?: string) => void) => async (dispatch: Dispatch<Actions.Upload>, getState: () => AppState) => {
    console.log('uploading file...');
    console.log('file', file);

    const appState = getState();
    const orgId = appState.user.activeRole?.role.org?.id;

    if (!appState.user.activeRole || !orgId) {
      console.log('User has no active role for orgId, cannot upload roster.');
      return;
    }

    let response: RosterClient.UploadResponse | undefined;
    let message: string | undefined;

    try {
      response = await RosterClient.upload(orgId, file);
    } catch (error) {
      message = formatMessage(error, 'Failed to upload roster');
    } finally {
      onComplete(response ?? { count: -1, errors: undefined }, message);
    }

    console.log('upload complete!');

    dispatch(new Actions.Upload());
  };

  export const fetchColumns = (orgId: number) => async (dispatch: Dispatch) => {
    dispatch(new Actions.FetchColumns());
    try {
      const columns = await RosterClient.fetchColumns(orgId);
      dispatch(new Actions.FetchColumnsSuccess({ columns }));
    } catch (error) {
      dispatch(new Actions.FetchColumnsFailure({ error }));
    }
  };

  export const deleteAll = (orgId: number) => async (dispatch: Dispatch) => {
    dispatch(new Actions.DeleteAll());
    try {
      await RosterClient.deleteAll(orgId);
      dispatch(new Actions.DeleteAllSuccess());
    } catch (error) {
      dispatch(new Actions.DeleteAllFailure({ error }));
    }
  };
}
