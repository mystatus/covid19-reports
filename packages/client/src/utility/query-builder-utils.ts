import {
  getFullyQualifiedColumnName,
  QueryOp,
  QueryValueScalarType,
  QueryValueType,
  FilterConfig,
  ColumnType,
} from '@covid19-reports/shared';
import moment from 'moment';

export type QueryFieldEnumItem = {
  label: string;
  value: string | number;
};

export type QueryField = {
  displayName?: string;
  name: string;
  table?: string;
  type: ColumnType;
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
    case ColumnType.Enum:
      return field.enumItems![0].value;
    case ColumnType.Boolean:
      return false;
    case ColumnType.Date:
      return moment().format(queryDateFormat);
    case ColumnType.DateTime:
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
    case ColumnType.Boolean:
    case ColumnType.Enum:
      return {
        '=': 'is',
        '<>': 'is not',
        null: 'is null',
        notnull: 'is not null',
      };
    case ColumnType.String:
      return {
        '=': 'is',
        '<>': 'is not',
        null: 'is null',
        notnull: 'is not null',
        in: 'in',
        '~': 'contains',
        startsWith: 'starts with',
        endsWith: 'ends with',
      };
    case ColumnType.Date:
    case ColumnType.DateTime:
      return {
        '=': 'is',
        '<>': 'is not',
        '>': 'after',
        '<': 'before',
        null: 'is null',
        notnull: 'is not null',
        between: 'between',
      };
    case ColumnType.Number:
      return {
        '=': 'is',
        '<>': 'is not',
        '>': 'greater than',
        '<': 'less than',
        null: 'is null',
        notnull: 'is not null',
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

export function opRequiresValue(op: QueryOp) {
  return op !== 'null' && op !== 'notnull';
}

/**
 * Converts an array of QueryRows into a FilterConfig object.
 */
export function queryRowsToFilterConfig(queryRows: QueryRow[]): FilterConfig {
  const config: FilterConfig = {};
  const validQueryRows = queryRows.filter(row => (
    (row.field && !opRequiresValue(row.op))
    || (row.value !== null && row.value !== undefined)
  ));

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

    const columnName = row.field.table
      ? `${row.field.table}.${row.field.name}`
      : row.field.name;

    config[columnName] = {
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
    .filter(field => !!filterConfig[getFullyQualifiedColumnName(field)])
    .map((field): QueryRow => ({
      ...filterConfig[getFullyQualifiedColumnName(field)],
      field,
    }));
}

export function isValidMathExpression(expression: string) {
  const regex = /^([-+/*]\d+(\.\d+)?)*/;
  return regex.test(expression);
}

export function evalMathExpression(expression: string) {
  if (!isValidMathExpression(expression)) {
    return {
      isValid: false,
      value: NaN,
    };
  }

  let isValid: boolean;
  let value: number;
  try {
    // eslint-disable-next-line no-eval
    value = eval(expression);
    isValid = true;
  } catch (err) {
    value = NaN;
    isValid = false;
  }

  return { isValid, value };
}

export function evalDateExpression(expression: string) {
  let isValid: boolean;
  let value: string;
  try {
    const jsonValue = JSON.parse(expression);
    value = moment().startOf('day').add(jsonValue).toISOString();
    isValid = true;
  } catch (e) {
    value = '';
    isValid = false;
  }

  return { isValid, value };
}

export function getExpressionHelperText(row: QueryRow, isExpressionValid: boolean) {
  return (row.expression && !isExpressionValid)
    ? 'Invalid expression'
    : row.value;
}
