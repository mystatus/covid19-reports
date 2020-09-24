import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { BadRequestError, RequestError } from './error-types';

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  // Send an error response if one hasn't already been sent. Otherwise the reqeust will
  // fail and make the client hang.
  if (res.headersSent) {
    return;
  }

  console.error(error);

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

    if (process.env.NODE_ENV === 'development') {
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
        console.log('Unknown Internal Server Error: ', error);
      }
    }
  }

  res.status(statusCode || 500);

  if (error.showErrorPage && error.errorPage) {
    res.sendFile(path.join(__dirname, '../public', error.errorPage));
  } else {
    res.send({ errors });
    next();
  }
}
