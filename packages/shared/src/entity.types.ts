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
}

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
  value: ColumnValue
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


// type Boxed<Mapping> = { [K in keyof Mapping]: { key: K; value: Mapping[K] } }[keyof Mapping];

// function paired<Mapping>(key: keyof Mapping, value: Mapping[keyof Mapping]) {
//   return { key, value } as Boxed<Mapping>;
// }

// export type ColumnInfoWithValue<T extends ColumnInfo> = ColumnInfo & {
//   value: ColumnTypeMapping[T['type']];
// };

