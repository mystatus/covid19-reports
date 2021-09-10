import { SavedFilterSerialized } from '@covid19-reports/shared';
import { AppState } from '../store';

export namespace SavedFilterSelector {
  export const rosterEntry = (state: AppState): SavedFilterSerialized[] => state.filters.filters.roster;
  export const observation = (state: AppState): SavedFilterSerialized[] => state.filters.filters.observation;
}
