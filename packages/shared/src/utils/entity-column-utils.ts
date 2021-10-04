import _ from 'lodash';
import moment from 'moment-timezone';
import {
  baseObservationColumnLookup,
  CustomColumnConfigEnum,
  edipiColumnDisplayName,
} from '..';
import {
  ColumnInfo,
  ColumnType,
} from '../entity.types';

const delimiters = {
  table: '.',
};

type FullyQualifiedColumnNameParts = {
  table?: string;
  name: string;
  custom?: boolean;
};

export function getFullyQualifiedColumnName(column: FullyQualifiedColumnNameParts, alias?: string) {
  // Base columns need to be in snake case to work in raw queries, since TypeORM converts
  // them to snake case internally.
  const columnName = !column.custom
    ? _.snakeCase(column.name)
    : column.name;

  const tableOrAlias = column.table ?? alias;
  return tableOrAlias
    ? [tableOrAlias, columnName].join(delimiters.table)
    : columnName;
}

function getFullyQualifiedColumnNameParts(fullyQualifiedName: string): FullyQualifiedColumnNameParts {
  const parts = fullyQualifiedName.split(delimiters.table);
  if (parts.length < 1 && parts.length > 2) {
    throw new Error('Column path must be in format {table}.{columnName}');
  }

  return parts.length === 1
    ? { name: parts[0] }
    : {
      table: parts[0],
      name: parts[1],
    };
}

export function findColumnByFullyQualifiedName(fullyQualifiedName: string, columns: ColumnInfo[]): ColumnInfo | undefined {
  const { table, name } = getFullyQualifiedColumnNameParts(fullyQualifiedName);

  // HACK: Unit is a special case at the moment, but should eventually become a custom column.
  if (name === 'unit') {
    return baseObservationColumnLookup.unit;
  }

  // Force every column name to snake case in comparisons, since some column names may still
  // be in camel case.
  return columns.find(x => x.table === table && _.snakeCase(x.name) === _.snakeCase(name));
}

export function getColumnSelect(column: ColumnInfo, alias?: string) {
  if (!column.custom) {
    return getFullyQualifiedColumnName({
      table: column.table,
      name: column.name,
    }, alias);
  }

  // Assume that every model with custom columns will store them the same way
  // on a `customColumns: CustomColumns` field.
  const tableOrAlias = column.table ?? alias;
  return tableOrAlias
    ? `"${tableOrAlias}"."custom_columns" ->> '${column.name}'`
    : `"custom_columns" ->> '${column.name}'`;
}

export function formatColumnSelect(columnSelect: string, column: ColumnInfo) {
  // HACK: Units are a special case right now for the roster table.
  if (columnSelect === 'roster.unit') {
    return columnSelect;
  }

  switch (column.type) {
    case ColumnType.String:
      return `LOWER(${columnSelect})`;
    case ColumnType.DateTime:
      return `date_trunc('minute', (${columnSelect})::TIMESTAMP)`;
    case ColumnType.Date:
      return `date_trunc('day', (${columnSelect})::TIMESTAMP)`;
    case ColumnType.Boolean:
      return `(${columnSelect})::BOOLEAN`;
    case ColumnType.Number:
      return `(${columnSelect})::DOUBLE PRECISION`;
    default:
      return columnSelect;
  }
}

export function getFullyQualifiedColumnDisplayName(column: {
  displayName?: string;
  table?: string;
}) {
  if (!column.displayName) {
    return '';
  }
  return column.table ? `${column.displayName} (${column.table})` : column.displayName;
}

export function friendlyColumnValue<T extends Record<string, any>>(
  entity: T,
  column: Pick<ColumnInfo, 'type' | 'config' | 'table' | 'name'>,
) {
  const name = getFullyQualifiedColumnName(column);
  const value = entity[name];
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
    case ColumnType.Enum:
      return getEnumColumnValue(column, value);
    default:
      return value;
  }
}

export function columnTypeToDataType(columnType: ColumnType) {
  // Get dates and enums as strings.
  switch (columnType) {
    case ColumnType.Date:
    case ColumnType.DateTime:
    case ColumnType.Enum:
      return ColumnType.String;
    default:
      return columnType;
  }
}

export function isEdipiColumn(column: ColumnInfo) {
  return column.displayName === edipiColumnDisplayName;
}

export function getEnumColumnValue(column: Pick<ColumnInfo, 'type' | 'config'>, uuid: string) {
  if (column.type === ColumnType.Enum) {
    const enumConfig = column.config as CustomColumnConfigEnum;
    const selectedOption = enumConfig.options?.find(option => option.id === uuid);
    return selectedOption?.label;
  }
  return null;
}
