import {
  ColumnInfo,
  EntityType,
  SavedFilterSerialized,
  SavedLayoutSerialized,
} from '@covid19-reports/shared';

export const viewLayoutDefaults = {
  maxTableColumns: 7,
  id: -1,
  name: 'Default',
} as const;

export type ViewLayoutId = SavedLayoutSerialized['id'];

export function makeDefaultViewLayout(entityType: EntityType, columns: ColumnInfo[], maxTableColumns: number) {
  const initial: SavedLayoutSerialized = {
    entityType,
    id: viewLayoutDefaults.id,
    name: viewLayoutDefaults.name,
    columns: {},
    actions: {},
  };
  columns.slice(0, maxTableColumns).forEach((column, index) => {
    initial.columns[column.name] = { order: index };
  });
  return initial;
}

export function isDefaultLayout(id: ViewLayoutId) {
  return id === viewLayoutDefaults.id;
}

export type FilterId = SavedFilterSerialized['id'];

export const customFilterId: FilterId = -1;
export const noFilterId: FilterId = -2;

export function isCustomFilter(id: FilterId) {
  return id === customFilterId;
}

export function makeNoFilter(entityType: EntityType) {
  return {
    id: noFilterId,
    name: 'No Filter',
    entityType,
    config: {},
  };
}

export function makeCustomFilter(entityType: EntityType) {
  return {
    id: customFilterId,
    name: 'Custom',
    entityType,
    config: {},
  };
}
