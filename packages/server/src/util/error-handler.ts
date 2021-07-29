import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { env } from './env';
import { RequestError } from './error-types';
import { Log } from './log';

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  // Send an error response if one hasn't already been sent. Otherwise the reqeust will
  // fail and make the client hang.
  if (res.headersSent) {
    return;
  }

  Log.error(error);

  let statusCode: number | undefined;
  let errors: ErrorData[];

  if (error.errors) {
    error.errors.forEach(Log.error);
    statusCode = error.errors[0].statusCode;
    errors = error.errors.map(errorToData);
  } else {
    statusCode = error.statusCode;
    errors = [errorToData(error)];
  }

  res.status(statusCode ?? 500);

  if (error.showErrorPage && error.errorPage && !env.isTest) {
    res.sendFile(path.join(__dirname, '../public', error.errorPage));
  } else {
    res.send({ errors });
    next();
  }
}

function errorToData(error: any): ErrorData {
  let message: string;
  let type: string | undefined;

  if (error instanceof RequestError) {
    message = error.message;
    type = error.type;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'An unknown error occurred!';
  }

  if (!type) {
    type = 'InternalServerError';
  }

  return {
    message,
    type,
    sourceError: (env.isProd) ? undefined : error,
  };
}

type ErrorData = {
  message: string;
  type: string;
  sourceError?: any;
};
