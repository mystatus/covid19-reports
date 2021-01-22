import { isAxiosError } from './axios';

export function formatMessage(error: Error, message = '', defaultErrorMessage = 'Internal Server Error', separator = '<br />') {
  let errorMessage = defaultErrorMessage;
  if (isAxiosError(error)) {
    const errors = error?.response?.data?.errors;
    if (errors?.length > 0) {
      errorMessage = errors.map((err: any) => err.message).join(separator) ?? defaultErrorMessage;
    }
  }
  return `${message}${message ? `: ${errorMessage}` : errorMessage}`;
}
