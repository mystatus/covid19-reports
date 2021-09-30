import { ColumnInfo, ColumnType, CustomColumns, MusterStatus } from './entity.types';


export type BaseObservationColumnInfo = ColumnInfo & {
  name: 'edipi' | 'timestamp' | 'unit' | 'muster_status';
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
    type: ColumnType.DateTime,
    pii: false,
    phi: false,
    custom: false,
    required: true,
    updatable: false,
  },
  unit: {
    name: 'unit',
    displayName: 'Reported Unit',
    type: ColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  },
  muster_status: {
    name: 'muster_status',
    displayName: 'Muster Status',
    type: ColumnType.Enum,
    config: {
      options: [{
        id: MusterStatus.NON_REPORTING,
        label: 'Did Not Report',
      }, {
        id: MusterStatus.ON_TIME,
        label: 'On Time',
      }, {
        id: MusterStatus.EARLY,
        label: 'Early',
      }, {
        id: MusterStatus.LATE,
        label: 'Late',
      }],
    },
    pii: false,
    phi: false,
    custom: false,
    required: true,
    updatable: false,
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
