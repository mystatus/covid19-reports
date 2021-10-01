export type ColumnValue = string | boolean | number | null;

export type CustomColumns = {
  [columnName: string]: ColumnValue;
};

export enum ColumnType {
  String = 'string',
  Number = 'number',
  Date = 'date',
  DateTime = 'datetime',
  Boolean = 'boolean',
  Enum = 'enum',
}

export type CustomColumnConfigString = {
  multiline?: boolean;
};

export type CustomColumnConfigEnumOption = {
  id: string;
  label: string;
};

export type CustomColumnConfigEnum = {
  options?: CustomColumnConfigEnumOption[];
};

export type CustomColumnConfig =
  | CustomColumnConfigString
  | CustomColumnConfigEnum;

export type ColumnInfo = {
  name: string;
  displayName: string;
  type: ColumnType;
  pii: boolean;
  phi: boolean;
  custom: boolean;
  required: boolean;
  updatable: boolean;
  config?: CustomColumnConfig;
  table?: string;
  aggregate?: string;
};

export type ColumnInfoWithValue = ColumnInfo & {
  value: ColumnValue;
};

export enum MusterStatus {
  EARLY = 'early',
  ON_TIME = 'on_time',
  LATE = 'late',
  NON_REPORTING = 'non_reporting',
}

export type QueryOp =
  | '='
  | '<>'
  | '~'
  | '>'
  | '<'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'between'
  | 'null'
  | 'notnull';

export type QueryValueScalarType = string | number | boolean;

export type QueryValueType = QueryValueScalarType | QueryValueScalarType[];

export const entityTypes = [
  'observation',
  'roster',
] as const;
export type EntityType = typeof entityTypes[number];
