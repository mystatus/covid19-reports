import moment from 'moment-timezone';

export type ColumnValue = string | boolean | number | null;

export enum ColumnType {
  String = 'string',
  Number = 'number',
  Date = 'date',
  DateTime = 'datetime',
  Boolean = 'boolean',
  Enum = 'enum',
}

export type ColumnTypeMapping = {
  [ColumnType.String]: string | null;
  [ColumnType.Number]: number | null;
  [ColumnType.Date]: ColumnValue;
  [ColumnType.DateTime]: ColumnValue;
  [ColumnType.Boolean]: boolean | null;
  [ColumnType.Enum]: ColumnValue;
};

export const friendlyColumnValue = <T>(entity: T & Record<string, unknown>, column: ColumnInfo) => {
  const value: any = entity[column.name];
  if (value == null) {
    return '';
  }
  switch (column.type) {
    case ColumnType.Date:
      return moment(value as string).format('l');
    case ColumnType.DateTime:
      return moment(value as string).format('lll');
    case ColumnType.Boolean:
      return value ? 'Yes' : 'No';
    default:
      return value;
  }
};

export const getFullyQualifiedColumnName = (column: { name: string; table?: string }) => {
  return column.table ? `${column.table}.${column.name}` : column.name;
};

export const getFullyQualifiedColumnDisplayName = (column: { displayName?: string; table?: string }) => {
  if (!column.displayName) {
    return '';
  }
  return column.table ? `${column.displayName} (${column.table})` : column.displayName;
};

export type NarrowTypeForColumnType<T extends ColumnType> = ColumnTypeMapping[T];

export type CustomColumnConfig = {};

export type CustomColumns = {
  [columnName: string]: ColumnValue;
};

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
