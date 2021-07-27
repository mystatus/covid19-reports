import { AppState } from '../store';

export namespace OrphanedRecordSelector {
  export const root = (state: AppState) => state.orphanedRecord;
}
