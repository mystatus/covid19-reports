/* eslint-disable @typescript-eslint/no-throw-literal */
import React from 'react';

export function useErrorHandler<P = Error>(givenError?: P | null | undefined): React.Dispatch<React.SetStateAction<P | null>> {
  const [error, setError] = React.useState<P | null>(null);

  if (givenError) {
    throw givenError;
  }
  if (error) {
    throw error;
  }
  return setError;
}
