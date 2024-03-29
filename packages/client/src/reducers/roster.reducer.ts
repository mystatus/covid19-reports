import { ColumnInfo } from '@covid19-reports/shared';
import { Roster } from '../actions/roster.actions';

export interface RosterState {
  columns: ColumnInfo[];
  columnsLoading: boolean;
  lastUpdated: number;
}

export const rosterInitialState: RosterState = {
  columns: [],
  columnsLoading: false,
  lastUpdated: 0,
};

export function rosterReducer(state = rosterInitialState, action: any) {
  switch (action.type) {
    case Roster.Actions.FetchColumns.type: {
      return {
        ...state,
        columnsLoading: true,
      };
    }
    case Roster.Actions.FetchColumnsSuccess.type: {
      const payload = (action as Roster.Actions.FetchColumnsSuccess).payload;
      return {
        ...state,
        columns: payload.columns,
        columnsLoading: false,
        columnsLastUpdated: Date.now(),
      };
    }
    case Roster.Actions.FetchColumnsFailure.type: {
      return {
        ...state,
        columns: [],
        columnsLoading: false,
      };
    }
    default:
      return state;
  }
}
