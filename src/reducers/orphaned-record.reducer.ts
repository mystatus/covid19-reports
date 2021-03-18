import { OrphanedRecord } from '../actions/orphaned-record.actions';
import { ApiOrphanedRecord } from '../models/api-response';

export interface OrphanedRecordState {
  orphanedRecords: ApiOrphanedRecord[],
  isLoading: boolean
  lastUpdated: number
}

export const orphanedRecordInitialState: OrphanedRecordState = {
  orphanedRecords: [],
  isLoading: false,
  lastUpdated: 0,
};

export function orphanedRecordReducer(state = orphanedRecordInitialState, action: any): OrphanedRecordState {
  switch (action.type) {
    case OrphanedRecord.Actions.Clear.type: {
      return {
        ...state,
        orphanedRecords: [],
        isLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case OrphanedRecord.Actions.Fetch.type: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case OrphanedRecord.Actions.FetchSuccess.type: {
      const payload = (action as OrphanedRecord.Actions.FetchSuccess).payload;
      return {
        ...state,
        orphanedRecords: payload.orphanedRecords,
        isLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case OrphanedRecord.Actions.FetchFailure.type: {
      return {
        ...state,
        orphanedRecords: [],
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
