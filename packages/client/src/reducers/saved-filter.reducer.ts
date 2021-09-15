import { SavedFilterSerialized } from '@covid19-reports/shared';
import { UserActions } from '../slices/user.slice';
import { SavedFilter } from '../actions/saved-filter.actions';

export interface EntityFilterMap {
  [key: string]: SavedFilterSerialized[];
}

export interface SavedFilterState {
  filters: EntityFilterMap;
  isLoading: boolean;
  lastUpdated: number;
}

export const savedFilterInitialState: SavedFilterState = {
  filters: {},
  isLoading: false,
  lastUpdated: 0,
};

export function savedFilterReducer(state = savedFilterInitialState, action: any) {
  switch (action.type) {
    case UserActions.changeOrg.type:
      return savedFilterInitialState;
    case SavedFilter.Actions.Fetch.type: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case SavedFilter.Actions.FetchSuccess.type: {
      const payload = (action as SavedFilter.Actions.FetchSuccess).payload;
      const newFilters = { ...state.filters };
      newFilters[payload.entityType] = payload.filters;
      return {
        ...state,
        filters: newFilters,
        isLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case SavedFilter.Actions.FetchFailure.type: {
      return {
        ...state,
        filters: {},
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
