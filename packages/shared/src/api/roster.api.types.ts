import { CustomColumnData } from '@covid19-reports/shared';
import {
  RosterEntryData,
} from '../roster.types';

export type ReportDateQuery = {
  reportDate: string;
};

export type AddCustomColumnBody = CustomColumnData & Required<Pick<CustomColumnData, 'displayName' | 'type'>>;

export type UpdateCustomColumnBody = CustomColumnData;

export type AddRosterEntryBody = RosterEntryData;

export type UpdateRosterEntryBody = RosterEntryData;
