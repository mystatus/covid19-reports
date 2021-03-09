import { Dispatch } from 'redux';
import { OrphanedRecordClient } from '../client';
import { ApiOrphanedRecord } from '../models/api-response';

export namespace OrphanedRecord {

  export namespace Actions {

    export class Fetch {
      static type = 'FETCH_ORPHANED_RECORD';
      type = Fetch.type;
    }
    export class FetchSuccess {
      static type = `${Fetch.type}_SUCCESS`;
      type = FetchSuccess.type;
      constructor(public payload: {
        orphanedRecords: ApiOrphanedRecord[]
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
      const orphanedRecords = await OrphanedRecordClient.fetchAll(orgId);
      dispatch(new Actions.FetchSuccess({ orphanedRecords }));
    } catch (error) {
      dispatch(new Actions.FetchFailure({ error }));
    }
  };
}
