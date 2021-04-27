import { OrphanedRecordState } from '../reducers/orphaned-record.reducer';
import { AppState } from '../store';

export namespace OrphanedRecordSelector {
  export const root = (state: AppState): OrphanedRecordState => state.orphanedRecord;
}
