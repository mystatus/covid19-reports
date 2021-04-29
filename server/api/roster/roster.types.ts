import { CustomColumnConfig } from './custom-roster-column.model';

export interface CustomColumns {
  [columnName: string]: RosterColumnValue | undefined
}

export type RosterColumnValue = string | boolean | number | null;

export enum RosterColumnType {
  String = 'string',
  Number = 'number',
  Date = 'date',
  DateTime = 'datetime',
  Boolean = 'boolean',
  Enum = 'enum',
}

export interface RosterColumnInfo {
  name: string,
  displayName: string,
  type: RosterColumnType,
  pii: boolean,
  phi: boolean,
  custom: boolean,
  required: boolean,
  updatable: boolean,
  config?: CustomColumnConfig
}

