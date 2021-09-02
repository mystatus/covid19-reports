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
      return new Date(value as string).toLocaleDateString();
    case ColumnType.DateTime:
      return new Date(value as string).toUTCString();
    case ColumnType.Boolean:
      return value ? 'Yes' : 'No';
    default:
      return value;
  }
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
  | 'between';


export type QueryValueScalarType = string | number | boolean;

export type QueryValueType = QueryValueScalarType | QueryValueScalarType[];

export const entityTypes = [
  'observation',
  'roster',
] as const;
export type EntityType = typeof entityTypes[number];
