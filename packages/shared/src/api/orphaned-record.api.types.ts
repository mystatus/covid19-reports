import { OrphanedRecordActionType } from '../orphaned-record.types';
import { RosterEntryData } from '../roster.types';
import { PaginatedQuery } from './api.types';

export type AddOrphanedRecordBody = {
  documentId: string,
  timestamp: number,
  edipi: string,
  phone: string,
  reportingGroup: string,
  unit: string,
};

export type AddOrphanedRecordActionBody = {
  action: OrphanedRecordActionType,
  timeToLiveMs?: number
};

export type ResolveOrphanedRecordWithEditBody = RosterEntryData & {
  id: number
};

export type GetOrphanedRecordsQuery = PaginatedQuery & {
  unit?: string
};

export type ResolveOrphanedRecordWithAddBody = RosterEntryData;
