import { Dispatch } from 'redux';
import { ApiRosterColumnInfo } from '../models/api-response';
import { RosterClient } from '../client/roster.client';

export namespace Roster {

  export namespace Actions {

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

  export const fetchColumns = (orgId: number) => async (dispatch: Dispatch) => {
    dispatch({ ...new Actions.FetchColumns() });
    try {
      const columns = await RosterClient.getRosterColumnsInfo(orgId);
      dispatch({ ...new Actions.FetchColumnsSuccess({ columns }) });
    } catch (error) {
      dispatch({ ...new Actions.FetchColumnsFailure({ error }) });
    }
  };

  export const deleteAll = (orgId: number) => async (dispatch: Dispatch) => {
    dispatch({ ...new Actions.DeleteAll() });
    try {
      await RosterClient.deleteRosterEntries(orgId);
      dispatch({ ...new Actions.DeleteAllSuccess() });
    } catch (error) {
      dispatch({ ...new Actions.DeleteAllFailure({ error }) });
    }
  };
}
