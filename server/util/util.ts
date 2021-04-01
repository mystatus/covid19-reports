import moment from 'moment';
import { ValueTransformer } from 'typeorm';
import { BadRequestError } from './error-types';


export function dateFromString(dateStr: string, shouldThrow = true) {
  if (dateStr && dateStr.length > 0) {
    const numericDate = Number(dateStr);
    let date: Date;
    if (!Number.isNaN(numericDate)) {
      date = new Date(numericDate);
    } else {
      date = new Date(dateStr);
    }
    if (Number.isNaN(date.getTime())) {
      if (shouldThrow) {
        throw new BadRequestError(`Unable to parse date '${dateStr}'.  Valid dates are ISO formatted date strings and UNIX timestamps.`);
      } else {
        return undefined;
      }
    }
    return date;
  }
  return undefined;
}

export function getOptionalParam<T extends object, K extends keyof T>(param: K, params: T, type: BaseType = 'string', altParam?: K): T[K] | undefined {
  let p = param;
  if (!params.hasOwnProperty(param)) {
    if (!altParam || !params.hasOwnProperty(altParam)) {
      return undefined;
    }
    p = altParam;
  }
  if (params[p] !== null && typeof params[p] !== type) {
    throw new BadRequestError(`Expected type '${type}' for parameter '${p}', but type was '${typeof params[p]}'.`);
  }
  return params[p];
}

export function getRequiredParam<T extends object, K extends keyof T>(param: K, params: T, type: BaseType = 'string', altParam?: K): T[K] {
  let p = param;
  if (!params.hasOwnProperty(param)) {
    if (!altParam || !params.hasOwnProperty(altParam)) {
      throw new BadRequestError(`Missing parameter: ${param}`);
    }
    p = altParam;
  }

  if (typeof params[p] !== type) {
    throw new BadRequestError(`Expected type '${type}' for parameter '${p}', but type was '${typeof params[p]}'.`);
  }
  return params[p];
}

export function escapeRegExp(value: string) {
  return value.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function sanitizeIndexPrefix(prefix: string) {
  return prefix.replace(/\s*$/g, '').replace(/[^a-z0-9_]/gi, '_').toLowerCase();
}

export function matchWildcardString(str: string, pattern: string) {
  const escapeRegex = (part: string) => part.replace(/([.*+?^=!:${}()|[]\/\\])/g, '\\$1');
  return new RegExp(`^${pattern.split('*').map(escapeRegex).join('.*')}$`).test(str);
}

export type BaseType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'function'
  | 'undefined';

export enum DaysOfTheWeek {
  None = 0,
  Sunday = 1,
  Monday = 2,
  Tuesday = 4,
  Wednesday = 8,
  Thursday = 16,
  Friday = 32,
  Saturday = 64,
}

export function nextDay(day: DaysOfTheWeek) {
  // eslint-disable-next-line no-bitwise
  return day << 1;
}

// Determine if an input day is in the given set
export function dayIsIn(day: DaysOfTheWeek, set: DaysOfTheWeek) {
  // eslint-disable-next-line no-bitwise
  return (set & day) === day;
}

export const dateColumnTransformer: ValueTransformer = {
  from: value => {
    return value ? moment(value, 'Y-M-D').toDate() : value;
  },
  to: value => {
    return value ? moment(value).format('Y-M-D') : value;
  },
};

export const dateTimeColumnTransformer: ValueTransformer = {
  from: value => {
    return value ? moment(value).toDate() : value;
  },
  to: value => {
    return value ? moment(value).toISOString() : value;
  },
};

export const timestampColumnTransformer: ValueTransformer = {
  from: value => {
    return value ? moment.utc(value).toDate() : value;
  },
  to: value => {
    return value ? moment.utc(value).format('YYYY-MM-DD HH:mm:ss.SSS') : value;
  },
};

export const oneDaySeconds = 24 * 60 * 60;

export type TimeInterval =
  | 'day'
  | 'week'
  | 'month'
  | 'year';

export function getElasticsearchTimeInterval(interval: TimeInterval) {
  switch (interval) {
    case 'day': return 'd';
    case 'week': return 'w';
    case 'month': return 'M';
    case 'year': return 'y';
    default:
      throw new Error(`Unsupported time interval '${interval}'`);
  }
}

export function getElasticsearchDateFormat(interval: TimeInterval) {
  switch (interval) {
    case 'day':
    case 'week': return 'yyyy-MM-dd';
    case 'month': return 'yyyy-MM';
    case 'year': return 'yyyy';
    default:
      throw new Error(`Unsupported interval '${interval}'`);
  }
}

export function getMomentDateFormat(interval: TimeInterval) {
  switch (interval) {
    case 'day':
    case 'week': return 'yyyy-MM-DD';
    case 'month': return 'yyyy-MM';
    case 'year': return 'yyyy';
    default:
      throw new Error(`Unsupported interval '${interval}'`);
  }
}
