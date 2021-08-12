import { ColumnInfo } from '@covid19-reports/shared';
import { AppState } from '../store';

export namespace RosterSelector {
  export const columns = (state: AppState): ColumnInfo[] => state.roster.columns;
}
