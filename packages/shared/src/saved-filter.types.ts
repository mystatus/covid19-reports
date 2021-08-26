import { EntityType, QueryOp, QueryValueType } from './entity.types';
import { OrgSerialized } from './org.types';

export type FilterConfig = {
  [column: string]: FilterConfigItem;
};

export type FilterConfigItem = {
  op: QueryOp;
  value: QueryValueType;
  expression: string;
  expressionRef?: string;
  expressionEnabled: boolean;
};

export type SavedFilterSerialized = {
  id: number;
  org?: OrgSerialized;
  name: string;
  entityType: EntityType;
  config: FilterConfig;
};
