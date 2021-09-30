import { ApiRequest } from '../api/api.router';
import { BadRequestError } from './error-types';
import { getMissingKeys } from './util';

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

export function assertRequestParams<TParams, TParamsKey extends keyof TParams>(
  req: ApiRequest<TParams, unknown, unknown>,
  requiredKeys: Array<TParamsKey>,
) {
  const missingKeys = getMissingKeys(req.params, requiredKeys);
  if (missingKeys.length) {
    throw new BadRequestError(`Missing required request url params: ${missingKeys.join(', ')}`);
  }

  return req.params;
}

export function assertIsNumber(checkNumber: string) {
  if (Number.isNaN(parseInt(checkNumber))) {
    throw new BadRequestError('number required, but not provided');
  }
  return true;
}
