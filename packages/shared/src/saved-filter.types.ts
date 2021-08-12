import { QueryOp, QueryValueType } from './entity.types';
import { OrgSerialized } from './org.types';

export enum FilterEntityType {
  Observation = 'Observation',
  RosterEntry = 'RosterEntry',
}

export type FilterConfig = {
  [column: string]: FilterConfigItem;
};

export type FilterConfigItem = {
  op: QueryOp;
  value: QueryValueType;
  expression: string;
  expressionEnabled: boolean;
};

export type SavedFilterSerialized = {
  id: number;
  org?: OrgSerialized;
  name: string;
  entityType: FilterEntityType;
  config: FilterConfig;
};
