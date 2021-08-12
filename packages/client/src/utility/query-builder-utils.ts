import {
  QueryOp,
  QueryValueScalarType,
  QueryValueType,
  FilterConfig,
} from '@covid19-reports/shared';
import moment from 'moment';

export enum QueryFieldType {
  String = 'string',
  Boolean = 'boolean',
  Date = 'date',
  DateTime = 'datetime',
  Number = 'number',
  Enum = 'enum',
}

export type QueryFieldEnumItem = {
  label: string;
  value: string | number;
};

export type QueryField = {
  displayName?: string;
  name: string;
  type: QueryFieldType;
  enumItems?: QueryFieldEnumItem[];
};

export type QueryRow = {
  field: QueryField;
  op: QueryOp;
  value: QueryValueType;
  expression: string;
  expressionEnabled: boolean;
};

export const queryDateFormat = 'YYYY-MM-DD';

export function isArrayOp(op: QueryOp) {
  return op === 'between' || op === 'in';
}

export function getFieldDefaultQueryValue(field: QueryField): QueryValueScalarType {
  switch (field.type) {
    case QueryFieldType.Enum:
      return field.enumItems![0].value;
    case QueryFieldType.Boolean:
      return false;
    case QueryFieldType.Date:
      return moment().format(queryDateFormat);
    case QueryFieldType.DateTime:
      return moment().toISOString();
    default:
      return '';
  }
}

export function getFieldDefaultQueryValueForOp(field: QueryField, op: QueryOp): QueryValueType {
  const value = getFieldDefaultQueryValue(field);
  return isArrayOp(op) ? [value] : value;
}

export type QueryOpsDesc = {
  [K in QueryOp]?: string;
};

export function getFieldQueryOpDesc(field: QueryField): QueryOpsDesc {
  switch (field.type) {
    case QueryFieldType.Boolean:
    case QueryFieldType.Enum:
      return {
        '=': 'is',
        '<>': 'is not',
      };
    case QueryFieldType.String:
      return {
        '=': 'is',
        in: 'in',
        '<>': 'is not',
        '~': 'contains',
        startsWith: 'starts with',
        endsWith: 'ends with',
      };
    case QueryFieldType.Date:
    case QueryFieldType.DateTime:
      return {
        '=': 'is',
        '<>': 'is not',
        '>': 'after',
        '<': 'before',
        between: 'between',
      };
    case QueryFieldType.Number:
      return {
        '=': 'is',
        '<>': 'is not',
        '>': 'greater than',
        '<': 'less than',
        between: 'between',
      };
    default:
      throw new Error(`Query field type "${field.type}" is not recognized.`);
  }
}

export function getFieldDefaultQueryOp(field: QueryField): QueryOp {
  const opDesc = getFieldQueryOpDesc(field);
  return Object.keys(opDesc)[0] as QueryOp;
}

/**
 * Converts an array of QueryRows into a FilterConfig object.
 */
export function queryRowsToFilterConfig(queryRows: QueryRow[]): FilterConfig {
  const config: FilterConfig = {};
  const validQueryRows = queryRows.filter(row => row.field && row.value);

  for (const row of validQueryRows) {
    let value = row.value;

    // Split list values into an array.
    if (row.op === 'in') {
      // Handle "dirty" lists, e.g.  1000000001 ,,  ,1000000003 1000000004;1000000005
      const listValues = String(row.value).trim().split(/[\s,;]+/).filter(vl => vl);

      // Don't add empty value lists.
      if (!listValues?.length) {
        continue;
      }

      value = listValues;
    }

    config[row.field.name] = {
      op: row.op,
      expression: row.expression ?? '',
      expressionEnabled: row.expressionEnabled ?? false,
      value,
    };
  }

  return config;
}

/**
 * Converts a FilterConfig object into an array of QueryRows.
 */
export function filterConfigToQueryRows(filterConfig: FilterConfig, fields: QueryField[]): QueryRow[] {
  return fields
    .filter(field => !!filterConfig[field.name])
    .map((field): QueryRow => ({
      ...filterConfig[field.name],
      field,
    }));
}
