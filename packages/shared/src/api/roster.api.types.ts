import { PaginatedQuery } from './api.types';
import {
  CustomColumnConfig,
  QueryOp,
  RosterColumnType,
  RosterColumnValue,
  RosterEntryData,
} from '../roster.types';

export type CustomColumnData = {
  type?: RosterColumnType;
  pii?: boolean;
  phi?: boolean;
  required?: boolean;
  config?: CustomColumnConfig;
  displayName?: string;
};

export type GetRosterQuery = {
  orderBy?: string;
  sortDirection?: 'ASC' | 'DESC';
} & PaginatedQuery;

export type SearchRosterQuery = GetRosterQuery;

export type SearchRosterBodyEntry = {
  op: QueryOp;
  value: RosterColumnValue | RosterColumnValue[];
  expression?: string;
  expressionEnabled?: boolean;
};

export type SearchRosterBody = {
  [column: string]: SearchRosterBodyEntry;
};

export type ReportDateQuery = {
  reportDate: string;
};

export type AddCustomColumnBody = CustomColumnData & Required<Pick<CustomColumnData, 'displayName' | 'type'>>;

export type UpdateCustomColumnBody = CustomColumnData;

export type AddRosterEntryBody = RosterEntryData;

export type UpdateRosterEntryBody = RosterEntryData;
