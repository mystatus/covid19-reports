import { AxiosError } from 'axios';
import { ErrorInfo } from 'react';

export function formatMessage(error: Error, message: string, defaultErrorMessage = 'Internal Server Error') {
  let errorMessage = defaultErrorMessage;
  const axiosError = error as AxiosError;
  if (axiosError?.response?.data?.errors && axiosError?.response.data.errors.length > 0) {
    errorMessage = axiosError?.response.data.errors[0].message;
  }
  return `${message}${errorMessage ? `: ${errorMessage}` : ''}`;
}


export class AlertError extends Error {
  constructor(
    message: string,
    readonly title: string = 'Error',
    readonly errorInfo: ErrorInfo | null = null,
  ) {
    super(message);
  }
}
