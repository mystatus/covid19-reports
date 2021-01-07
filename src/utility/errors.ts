import { AxiosError } from 'axios';
import { isAxiosError } from './axios';

export function formatMessage(error: Error, message = '', defaultErrorMessage = 'Internal Server Error') {
  let errorMessage = defaultErrorMessage;
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.data?.errors && axiosError?.response.data.errors.length > 0) {
      errorMessage = axiosError?.response.data.errors[0].message ?? defaultErrorMessage;
    }
  }
  return `${message}${message ? `: ${errorMessage}` : errorMessage}`;
}
