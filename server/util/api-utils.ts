import { ApiRequest } from '../api';
import { BadRequestError } from './error-types';

export function assertRequestQuery<TQuery, TQueryKey extends keyof TQuery>(
  req: ApiRequest<unknown, unknown, TQuery>,
  requiredKeys: Array<TQueryKey>,
) {
  const missingKeys = getMissingKeys(req.query, requiredKeys);
  if (missingKeys.length) {
    throw new BadRequestError(`Missing required request query params: ${missingKeys.join(', ')}`);
  }

  return req.query;
}

export function assertRequestBody<TBody, TBodyKey extends keyof TBody>(
  req: ApiRequest<unknown, TBody, unknown>,
  requiredKeys: Array<TBodyKey>,
) {
  const missingKeys = getMissingKeys(req.body, requiredKeys);
  if (missingKeys.length) {
    throw new BadRequestError(`Missing required request body params: ${missingKeys.join(', ')}`);
  }

  return req.body;
}

function getMissingKeys<T, K extends keyof T>(obj: T, keys: Array<K>) {
  return keys.filter(key => obj[key] === undefined);
}
