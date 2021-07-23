import { AppState } from '../store';
import { OrphanedRecordState } from '../slices/orphaned-record.slice';

export namespace OrphanedRecordSelector {
  export const root = (state: AppState): OrphanedRecordState => state.orphanedRecord;
}
