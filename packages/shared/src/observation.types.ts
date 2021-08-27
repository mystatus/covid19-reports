import { ColumnInfo, ColumnType, CustomColumns } from './entity.types';


export type BaseObservationColumnInfo = ColumnInfo & {
  name: 'edipi' | 'timestamp' | 'unit';
};

export const baseObservationColumnLookup: Readonly<{
  [K in BaseObservationColumnInfo['name']]: Readonly<BaseObservationColumnInfo>
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
  timestamp: {
    name: 'timestamp',
    displayName: 'Timestamp',
    type: ColumnType.Date,
    pii: false,
    phi: false,
    custom: false,
    required: true,
    updatable: false,
  },
  unit: {
    name: 'unit',
    displayName: 'Unit',
    type: ColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  },
};

export const baseObservationColumns: Readonly<Readonly<BaseObservationColumnInfo>>[] = Object.values(baseObservationColumnLookup);
export const edipiColumnDisplayName = baseObservationColumnLookup.edipi.displayName;
export const unitColumnDisplayName = 'Unit';

export type ObservationEntryData = {
  edipi: string;
  timestamp: Date;
  unit: string;
  lastName?: string;
} & CustomColumns;

export type ObservationInfo = {
  columns: ColumnInfo[];
};
