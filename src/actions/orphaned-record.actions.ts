import { Dispatch } from 'redux';
import { OrphanedRecordClient } from '../client';
import {
  ApiOrphanedRecordsCount,
  ApiOrphanedRecordsPaginated,
} from '../models/api-response';

export namespace OrphanedRecord {

  export namespace Actions {

    export class Clear {
      static type = 'ORPHANED_RECORD_CLEAR';
      type = Clear.type;
    }

    export class FetchCount {
      static type = 'ORPHANED_RECORD_FETCH_COUNT';
      type = FetchCount.type;
    }
    export class FetchCountSuccess {
      static type = `${FetchCount.type}_SUCCESS`;
      type = FetchCountSuccess.type;
      constructor(public payload: ApiOrphanedRecordsCount) {}
    }
    export class FetchCountFailure {
      static type = `${FetchCount.type}_FAILURE`;
      type = FetchCountFailure.type;
      constructor(public payload: {
        error: any
      }) {}
    }

    export class FetchPage {
      static type = 'ORPHANED_RECORD_FETCH_PAGE';
      type = FetchPage.type;
    }
    export class FetchPageSuccess {
      static type = `${FetchPage.type}_SUCCESS`;
      type = FetchPageSuccess.type;
      constructor(public payload: ApiOrphanedRecordsPaginated) {}
    }
    export class FetchPageFailure {
      static type = `${FetchPage.type}_FAILURE`;
      type = FetchPageFailure.type;
      constructor(public payload: {
        error: any
      }) {}
    }
  }

  export const fetchCount = (orgId: number) => async (dispatch: Dispatch) => {
    dispatch(new Actions.FetchCount());
    try {
      const data = await OrphanedRecordClient.fetchCount(orgId);
      dispatch(new Actions.FetchCountSuccess(data));
    } catch (error) {
      dispatch(new Actions.FetchCountFailure({ error }));
    }
  };

  export const fetchPage = (orgId: number, page: number, limit: number, unit?: string) => async (dispatch: Dispatch) => {
    dispatch(new Actions.FetchPage());
    try {
      const data = await OrphanedRecordClient.fetchPage(orgId, page, limit, unit);
      dispatch(new Actions.FetchPageSuccess(data));
    } catch (error) {
      dispatch(new Actions.FetchPageFailure({ error }));
    }
  };

  export const clear = () => async (dispatch: Dispatch) => {
    dispatch(new Actions.Clear());
  };
}
