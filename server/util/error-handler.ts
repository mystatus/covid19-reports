import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { env } from './env';
import { BadRequestError, RequestError } from './error-types';
import { Log } from './log';

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  // Send an error response if one hasn't already been sent. Otherwise the reqeust will
  // fail and make the client hang.
  if (res.headersSent) {
    return;
  }

  Log.error(error);

  let statusCode;
  let errors;
  let message;

  if (error.errors) {
    errors = error.errors;
  } else {
    let type;

    if (error instanceof RequestError) {
      statusCode = error.statusCode;
      message = error.message;
      type = error.type;
    } else if (error instanceof String) {
      message = error;
    }

    if (!env.isProd) {
      errors = [{
        message: message || 'An unknown error occurred!',
        type: type || 'InternalServerError',
        sourceError: error,
      }];
    } else {
      errors = [{
        message: message || 'An unknown error occurred!',
        type: type || 'InternalServerError',
      }];
      if (!(error instanceof RequestError) || error instanceof BadRequestError) {
        Log.info('Unknown Internal Server Error: ', error);
      }
    }
  }

  res.status(statusCode || 500);

  if (error.showErrorPage && error.errorPage && !env.isTest) {
    res.sendFile(path.join(__dirname, '../public', error.errorPage));
  } else {
    res.send({ errors });
    next();
  }
}
