import _ from 'lodash';
import { ApiErrorResponse } from '../models/api-response';

export function formatErrorMessage(error: any, message = '', defaultErrorMessage = 'Internal Server Error') {
  let errorMessage: string | undefined;

  if (typeof error === 'string') {
    errorMessage = error;
  } else if (isErrorObject(error)) {
    errorMessage = error.message;
  } else if (isApiErrorResponse(error)) {
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

function isErrorObject(error: any): error is Error {
  return (error?.message != null);
}
