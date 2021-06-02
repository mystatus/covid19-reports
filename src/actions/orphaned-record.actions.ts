import { Dispatch } from 'redux';
import { OrphanedRecordClient } from '../client';
import { ApiOrphanedRecordsPaginated } from '../models/api-response';

export namespace OrphanedRecord {

  export namespace Actions {

    export class Clear {
      static type = 'ORPHANED_RECORD_CLEAR';
      type = Clear.type;
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
      }) { }
    }
  }

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
