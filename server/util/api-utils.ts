import { ApiRequest } from '../api';
import { BadRequestError } from './error-types';

export function assertRequestQuery<TQuery extends object>(
  req: ApiRequest<unknown, unknown, TQuery>,
  requiredKeys: Array<keyof TQuery>,
) {
  const missingKeys = getMissingKeys(req.query, requiredKeys);
  if (missingKeys.length) {
    throw new BadRequestError(`Missing required request query params: ${missingKeys.join(', ')}`);
  }

  return req.query;
}

export function assertRequestBody<TBody extends object>(
  req: ApiRequest<unknown, TBody, unknown>,
  requiredKeys: Array<keyof TBody>,
) {
  const missingKeys = getMissingKeys(req.body, requiredKeys);
  if (missingKeys.length) {
    throw new BadRequestError(`Missing required request body params: ${missingKeys.join(', ')}`);
  }

  return req.body;
}

function getMissingKeys<T extends object>(obj: T, keys: Array<keyof T>) {
  return keys.filter(key => obj[key] === undefined);
}
