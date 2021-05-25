import { RosterHistory } from '../roster-history/roster-history.model';
import { CustomColumnConfig } from './custom-roster-column.model';
import { RosterEntity } from './roster-entity';

export interface CustomColumns {
  [columnName: string]: RosterColumnValue
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
  exampleValue?: string
}

export enum RosterHistoryChangeType {
  Added = 'added',
  Changed = 'changed',
  Deleted = 'deleted',
}

export interface BaseRosterColumnInfo extends RosterColumnInfo {
  name: 'edipi' | 'firstName' | 'lastName'
}

export interface BaseRosterHistoryColumnInfo extends RosterColumnInfo {
  name: 'edipi' | 'firstName' | 'lastName' | 'timestamp' | 'changeType'
}

export const baseRosterColumnLookup: Readonly<{
  [K in BaseRosterColumnInfo['name']]: Readonly<BaseRosterColumnInfo>
}> = {
  edipi: {
    name: 'edipi',
    displayName: 'DoD ID',
    type: RosterColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: false,
    exampleValue: '0000000001',
  },
  firstName: {
    name: 'firstName',
    displayName: 'First Name',
    type: RosterColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  },
  lastName: {
    name: 'lastName',
    displayName: 'Last Name',
    type: RosterColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  },
};

export const baseRosterHistoryColumnLookup: Readonly<{
  [K in BaseRosterHistoryColumnInfo['name']]: Readonly<BaseRosterHistoryColumnInfo>
}> = {
  ...baseRosterColumnLookup,
  timestamp: {
    name: 'timestamp',
    displayName: 'Timestamp',
    type: RosterColumnType.DateTime,
    pii: false,
    phi: false,
    custom: false,
    required: true,
    updatable: false,
  },
  changeType: {
    name: 'changeType',
    displayName: 'Change Type',
    type: RosterColumnType.Enum,
    pii: false,
    phi: false,
    custom: false,
    required: true,
    updatable: false,
    exampleValue: RosterHistoryChangeType.Added,
  },
};

export const baseRosterColumns: Readonly<Readonly<BaseRosterColumnInfo>>[] = Object.values(baseRosterColumnLookup);
export const baseRosterHistoryColumns: Readonly<Readonly<BaseRosterHistoryColumnInfo>>[] = Object.values(baseRosterHistoryColumnLookup);

export const edipiColumnDisplayName = baseRosterColumnLookup.edipi.displayName;
export const unitColumnDisplayName = 'Unit';

export type RosterEntrySerialized = {
  edipi: RosterEntity['edipi'],
  unit: number,
  firstName?: RosterEntity['firstName'],
  lastName?: RosterEntity['lastName'],
} & CustomColumns;

export type RosterHistoryEntrySerialized = RosterEntrySerialized & {
  timestamp: string
  changeType: RosterHistory['changeType']
};

export interface RosterFileRow<TColumnValue = string> {
  Unit: TColumnValue
  [columnName: string]: TColumnValue
}

export interface RosterHistoryFileRow<TColumnValue = string> extends RosterFileRow<TColumnValue> {
  Timestamp: TColumnValue
  'Change Type': TColumnValue
}
