import {
  CustomColumnConfig,
  QueryOp,
  ColumnType,
  ColumnValue,
} from '../entity.types';

export type CustomColumnData = {
  type?: ColumnType;
  pii?: boolean;
  phi?: boolean;
  required?: boolean;
  config?: CustomColumnConfig;
  displayName?: string;
};

export type SearchBodyEntry = {
  op: QueryOp;
  value: ColumnValue | ColumnValue[];
  expression?: string;
  expressionEnabled?: boolean;
};

export type SearchBody = {
  [column: string]: SearchBodyEntry;
};
