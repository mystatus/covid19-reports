import { ApiRosterColumnInfo } from '../models/api-response';
import { AppState } from '../store';

export namespace RosterSelector {
  export const columns = (state: AppState): ApiRosterColumnInfo[] => state.roster.columns;
}
