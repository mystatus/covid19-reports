import _ from 'lodash';
import { ApiErrorResponse } from '../models/api-response';

export function formatErrorMessage(error: Error, message = '', defaultErrorMessage = 'Internal Server Error') {
  let errorMessage: string | undefined;

  if (isApiErrorResponse(error)) {
    const errors = error.data.errors;
    errorMessage = errors.map(err => err.message)
      .join('<br/><br/>')
      .replaceAll('\n', '<br/>');
  }

  if (!errorMessage) {
    errorMessage = defaultErrorMessage;
  }

  if (message) {
    return `${message}:<br/><br/>${errorMessage}`;
  }

  return errorMessage;
}

export function isApiErrorResponse(error: any): error is ApiErrorResponse {
  return _.isArray(error?.data?.errors);
}
