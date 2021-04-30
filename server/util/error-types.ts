import { OrphanedRecord } from '../api/orphaned-record/orphaned-record.model';

export class RequestError extends Error {
  type: RequestErrorType;
  statusCode: number;
  errorPage?: string;
  showErrorPage: boolean;

  constructor(message: string, type: RequestErrorType, statusCode: number, showErrorPage: boolean) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.showErrorPage = showErrorPage;
  }
}

export class BadRequestError extends RequestError {
  constructor(message: string, showErrorPage = false) {
    super(message, 'BadRequest', 400, showErrorPage);
    Error.captureStackTrace(this, BadRequestError);
  }
}

export class UnauthorizedError extends RequestError {
  errorPage = 'not-authorized.html';

  constructor(message: string, showErrorPage = false) {
    super(message, 'Unauthorized', 401, showErrorPage);
    Error.captureStackTrace(this, UnauthorizedError);
  }
}

export class ForbiddenError extends RequestError {
  errorPage = 'not-authorized.html';

  constructor(message: string, showErrorPage = false) {
    super(message, 'Forbidden', 403, showErrorPage);
    Error.captureStackTrace(this, ForbiddenError);
  }
}

export class NotFoundError extends RequestError {
  constructor(message: string, showErrorPage = false) {
    super(message, 'NotFound', 404, showErrorPage);
    Error.captureStackTrace(this, NotFoundError);
  }
}

export class UnprocessableEntity extends RequestError {
  constructor(message: string, showErrorPage = false) {
    super(message, 'UnprocessableEntity', 422, showErrorPage);
    Error.captureStackTrace(this, UnprocessableEntity);
  }
}

export class RosterUploadError extends RequestError {
  errors?: RosterUploadErrorInfo[];

  constructor(errors?: RosterUploadErrorInfo[], message = 'Roster Upload Error', showErrorPage = false) {
    super(message, 'RosterUploadError', 400, showErrorPage);
    this.errors = errors;
    Error.captureStackTrace(this, RosterUploadError);
  }
}

export class InternalServerError extends RequestError {
  constructor(message: string, showErrorPage = false) {
    super(message, 'InternalServerError', 500, showErrorPage);
    Error.captureStackTrace(this, InternalServerError);
  }
}

export class RequiredColumnError extends RequestError {
  constructor(columnName: string, showErrorPage = false) {
    const message = `Required column '${columnName}' cannot be empty, null, or undefined.`;
    super(message, 'BadRequest', 400, showErrorPage);
    Error.captureStackTrace(this, RequiredColumnError);
  }
}

export class DateParseError extends RequestError {
  constructor(date: any, showErrorPage = false) {
    const message = `Unable to parse date '${date}'. Valid dates are ISO formatted date strings and UNIX timestamps.`;
    super(message, 'BadRequest', 400, showErrorPage);
    Error.captureStackTrace(this, DateParseError);
  }
}

export class OrphanedRecordsNotFoundError extends RequestError {
  constructor(compositeId: OrphanedRecord['compositeId'], showErrorPage = false) {
    const message = `Unable to locate orphaned record with id: ${compositeId}`;
    super(message, 'NotFound', 404, showErrorPage);
    Error.captureStackTrace(this, OrphanedRecordsNotFoundError);
  }
}

export type RequestErrorType = (
  'BadRequest' |
  'Unauthorized' |
  'Forbidden' |
  'NotFound' |
  'UnprocessableEntity' |
  'RosterUploadError' |
  'InternalServerError'
);

export type RosterUploadErrorInfo = {
  error: string,
  edipi?: string,
  line?: number,
  column?: string,
};
