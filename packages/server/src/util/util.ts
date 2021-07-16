import moment from 'moment';
import { ValueTransformer } from 'typeorm';
import {
  BadRequestError,
  DateParseError,
} from './error-types';

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
        throw new DateParseError(dateStr);
      } else {
        return undefined;
      }
    }
    return date;
  }
  return undefined;
}

export function getOptionalValue<T extends object, K extends keyof T>(
  key: K,
  obj: T,
  expectedType: BaseType = 'string',
  altKey?: K,
): T[K] | undefined {
  let p = key;
  if (!obj.hasOwnProperty(key)) {
    if (!altKey || !obj.hasOwnProperty(altKey)) {
      return undefined;
    }
    p = altKey;
  }

  const value = obj[p];
  if (value !== null && typeof value !== expectedType) {
    throw new BadRequestError(`Expected type '${expectedType}' for '${p}', but type was '${typeof value}'.`);
  }

  return value;
}

export function getRequiredValue<T extends object, K extends keyof T>(
  key: K,
  obj: T,
  expectedType: BaseType = 'string',
  altKey?: K,
): T[K] {
  let p = key;
  if (!obj.hasOwnProperty(key)) {
    if (!altKey || !obj.hasOwnProperty(altKey)) {
      throw new BadRequestError(`Missing parameter: ${key}`);
    }
    p = altKey;
  }

  const value = obj[p];
  if (value !== null && typeof value !== expectedType) {
    throw new BadRequestError(`Expected type '${expectedType}' for '${p}', but type was '${typeof value}'.`);
  }

  return value;
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

export function getMissingKeys<T, K extends keyof T>(obj: T, keys: Array<K>) {
  return keys.filter(key => obj[key] === undefined);
}
