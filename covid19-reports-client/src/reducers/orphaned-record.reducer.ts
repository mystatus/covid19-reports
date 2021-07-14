import { OrphanedRecord } from '../actions/orphaned-record.actions';
import { ApiOrphanedRecord } from '../models/api-response';

export interface OrphanedRecordState {
  rows: ApiOrphanedRecord[],
  totalRowsCount: number
  count: number
  countLoading: boolean
  pageLoading: boolean
  lastUpdated: number
}

export const orphanedRecordInitialState: OrphanedRecordState = {
  rows: [],
  totalRowsCount: 0,
  count: 0,
  countLoading: false,
  pageLoading: false,
  lastUpdated: 0,
};

export function orphanedRecordReducer(state = orphanedRecordInitialState, action: any): OrphanedRecordState {
  switch (action.type) {
    case OrphanedRecord.Actions.Clear.type: {
      return { ...orphanedRecordInitialState };
    }
    case OrphanedRecord.Actions.FetchCount.type: {
      return {
        ...state,
        countLoading: true,
      };
    }
    case OrphanedRecord.Actions.FetchCountSuccess.type: {
      const { count } = (action as OrphanedRecord.Actions.FetchCountSuccess).payload;
      return {
        ...state,
        count,
        countLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case OrphanedRecord.Actions.FetchCountFailure.type: {
      return {
        ...state,
        countLoading: false,
      };
    }
    case OrphanedRecord.Actions.FetchPage.type: {
      return {
        ...state,
        pageLoading: true,
      };
    }
    case OrphanedRecord.Actions.FetchPageSuccess.type: {
      const { rows, totalRowsCount } = (action as OrphanedRecord.Actions.FetchPageSuccess).payload;
      return {
        ...state,
        rows,
        totalRowsCount,
        pageLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case OrphanedRecord.Actions.FetchPageFailure.type: {
      return {
        ...state,
        pageLoading: false,
      };
    }
    default:
      return state;
  }
}
