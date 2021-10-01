import {
  baseRosterColumnLookup,
  baseRosterColumns,
} from './roster.types';
import {
  baseObservationColumnLookup,
  baseObservationColumns,
} from './observation.types';
import {
  ColumnInfo,
  EntityType,
} from './entity.types';

export const baseEntityColumns: {
  [K in EntityType]: ColumnInfo[]
} = {
  roster: baseRosterColumns,
  observation: baseObservationColumns,
};

export const baseEntityColumnsLookup: {
  [K in EntityType]: {
    [columnName: string]: ColumnInfo;
  }
} = {
  roster: baseRosterColumnLookup,
  observation: baseObservationColumnLookup,
};
