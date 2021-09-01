import {
  ColumnInfo,
  EntityType,
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

export function isExistingLayout(id: ViewLayoutId) {
  return id !== viewLayoutDefaults.id;
}
