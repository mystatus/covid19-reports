export interface CustomColumns {
  [key: string]: CustomColumnValue
}

export type CustomColumnValue = string | boolean | number | null;

export enum RosterColumnType {
  String = 'string',
  Boolean = 'boolean',
  Date = 'date',
  DateTime = 'datetime',
  Number = 'number',
}

export interface RosterColumnInfo {
  name: string,
  displayName: string,
  type: RosterColumnType,
  pii: boolean,
  phi: boolean,
  custom: boolean,
  required: boolean,
  updatable: boolean,
}

