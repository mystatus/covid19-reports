import { BadRequestError } from './error-types';
import { ValueTransformer } from 'typeorm';
import moment from 'moment';


export function dateFromString(dateStr: string) {
  if (dateStr && dateStr.length > 0) {
    const numericDate = Number(dateStr);
    let date: Date;
    if (!Number.isNaN(numericDate)) {
      date = new Date(numericDate);
    } else {
      date = new Date(dateStr);
    }
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestError(`Unable to parse date '${dateStr}'.  Valid dates are ISO formatted date strings and UNIX timestamps.`);
    }
    return date;
  }
  return undefined;
}

export function getOptionalParam<T extends object, K extends keyof T>(param: K, params: T, type: BaseType = 'string'): T[K] | undefined {
  if (!params.hasOwnProperty(param)) {
    return undefined;
  }
  if (params[param] !== null && typeof params[param] !== type) {
    throw new BadRequestError(`Expected type '${type}' for parameter '${param}', but type was '${typeof params[param]}'.`);
  }
  return params[param];
}

export function getRequiredParam<T extends object, K extends keyof T>(param: K, params: T, type: BaseType = 'string'): T[K] {
  if (!params.hasOwnProperty(param)) {
    throw new BadRequestError(`Missing parameter: ${param}`);
  }
  if (typeof params[param] !== type) {
    throw new BadRequestError(`Expected type '${type}' for parameter '${param}', but type was '${typeof params[param]}'.`);
  }
  return params[param];
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

export type BaseType = (
  'string' |
  'number' |
  'boolean' |
  'object' |
  'function' |
  'undefined'
);

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
  }
}

export const dateTimeColumnTransformer: ValueTransformer = {
  from: value => {
    return value ? moment(value).toDate() : value;
  },
  to: value => {
    return value ? moment(value).toISOString() : value;
  }
}

export const timestampColumnTransformer: ValueTransformer = {
  from: value => {
    return value ? moment.utc(value).toDate() : value;
  },
  to: value => {
    return value ? moment(value).toISOString() : value;
  }
}

export const oneDaySeconds = 24 * 60 * 60;
