import { OrphanedRecord } from '../actions/orphaned-record.actions';
import { ApiOrphanedRecord } from '../models/api-response';

export interface OrphanedRecordState {
  rows: ApiOrphanedRecord[],
  totalRowsCount: number
  totalOrphanedRecordsCount: number
  units: string[]
  isLoading: boolean
  lastUpdated: number
}

export const orphanedRecordInitialState: OrphanedRecordState = {
  rows: [],
  totalRowsCount: 0,
  totalOrphanedRecordsCount: 0,
  units: [],
  isLoading: false,
  lastUpdated: 0,
};

export function orphanedRecordReducer(state = orphanedRecordInitialState, action: any): OrphanedRecordState {
  switch (action.type) {
    case OrphanedRecord.Actions.Clear.type: {
      return {
        ...state,
        rows: [],
        totalRowsCount: 0,
        totalOrphanedRecordsCount: 0,
        units: [],
        isLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case OrphanedRecord.Actions.FetchPage.type: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case OrphanedRecord.Actions.FetchPageSuccess.type: {
      const { rows, totalRowsCount, totalOrphanedRecordsCount, units } = (action as OrphanedRecord.Actions.FetchPageSuccess).payload;
      return {
        ...state,
        rows,
        totalRowsCount,
        totalOrphanedRecordsCount,
        units,
        isLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case OrphanedRecord.Actions.FetchPageFailure.type: {
      return {
        ...state,
        rows: [],
        totalRowsCount: 0,
        totalOrphanedRecordsCount: 0,
        units: [],
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
