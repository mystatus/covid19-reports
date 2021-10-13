import { ColumnInfo, ColumnType, CustomColumns } from './entity.types';
import { UnitSerialized } from './unit.types';


export type BaseRosterColumnInfo = ColumnInfo & {
  name: 'edipi' | 'unit' | 'firstName' | 'lastName';
};

export const baseRosterColumnLookup: Readonly<{
  [K in BaseRosterColumnInfo['name']]: Readonly<BaseRosterColumnInfo>
}> = {
  edipi: {
    name: 'edipi',
    displayName: 'DoD ID',
    type: ColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: false,
  },
  unit: {
    name: 'unit',
    displayName: 'Unit',
    type: ColumnType.Number,
    pii: false,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  },
  firstName: {
    name: 'firstName',
    displayName: 'First Name',
    type: ColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  },
  lastName: {
    name: 'lastName',
    displayName: 'Last Name',
    type: ColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  },
};

export const baseRosterColumns: Readonly<Readonly<BaseRosterColumnInfo>>[] = Object.values(baseRosterColumnLookup);

export type RosterEntryData = {
  edipi: string;
  unit: number;
  firstName?: string;
  lastName?: string;
} & CustomColumns;

export type RosterFileRow<TColumnValue = string> = {
  Unit: TColumnValue;
  [columnDisplayName: string]: TColumnValue;
};

export type RosterInfo = {
  unit: UnitSerialized;
  columns: ColumnInfo[];
};
