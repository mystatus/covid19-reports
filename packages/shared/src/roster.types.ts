import { UnitSerialized } from './unit.types';

export type CustomColumns = {
  [columnName: string]: RosterColumnValue,
};

export enum RosterColumnType {
  String = 'string',
  Number = 'number',
  Date = 'date',
  DateTime = 'datetime',
  Boolean = 'boolean',
  Enum = 'enum',
}

export type RosterColumnValue = string | boolean | number | null;

export type RosterColumnInfo = {
  name: string,
  displayName: string,
  type: RosterColumnType,
  pii: boolean,
  phi: boolean,
  custom: boolean,
  required: boolean,
  updatable: boolean,
  config?: CustomColumnConfig,
};

export type BaseRosterColumnInfo = RosterColumnInfo & {
  name: 'edipi' | 'firstName' | 'lastName',
};

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

export const baseRosterColumns: Readonly<Readonly<BaseRosterColumnInfo>>[] = Object.values(baseRosterColumnLookup);

export const edipiColumnDisplayName = baseRosterColumnLookup.edipi.displayName;
export const unitColumnDisplayName = 'Unit';

export type RosterEntryData = {
  edipi: string
  unit: number
  firstName?: string
  lastName?: string
} & CustomColumns;

export type RosterFileRow<TColumnValue = string> = {
  Unit: TColumnValue
  [columnDisplayName: string]: TColumnValue
};

export type QueryOp =
  | '='
  | '<>'
  | '~'
  | '>'
  | '<'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'between';

export type RosterColumnInfoWithValue = RosterColumnInfo & {
  value: RosterColumnValue
};

export type RosterInfo = {
  unit: UnitSerialized
  columns: RosterColumnInfo[]
};

export type CustomColumnConfig = {};
