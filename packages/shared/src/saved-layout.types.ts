import { EntityType } from './entity.types';
import { OrgSerialized } from './org.types';

export type ColumnConfig = {
  order: number;
};

export type ActionConfig = {
  order: number;
};

export type ColumnsConfig = {
  [fullyQualifiedColumnName: string]: ColumnConfig;
};

export type ActionsConfig = {
  [fullyQualifiedColumnName: string]: ColumnConfig;
};

export type SavedLayoutSerialized = {
  id: number;
  org?: OrgSerialized;
  name: string;
  entityType: EntityType;
  columns: ColumnsConfig;
  actions: ActionsConfig;
};
