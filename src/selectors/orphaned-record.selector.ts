import { ApiOrphanedRecord } from '../models/api-response';
import { AppState } from '../store';

export namespace OrphanedRecordSelector {
  export const all = (state: AppState): ApiOrphanedRecord[] => state.orphanedRecord.orphanedRecords;
}
