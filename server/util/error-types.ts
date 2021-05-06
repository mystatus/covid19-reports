import { OrphanedRecord } from '../api/orphaned-record/orphaned-record.model';
import { RosterFileRow } from '../api/roster/roster.types';

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
  errors?: Error[];

  constructor(errors?: Error[], message = 'Roster Upload Error', showErrorPage = false) {
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
  constructor(columnDisplayName: string, showErrorPage = false) {
    const message = `"${columnDisplayName}" is required.`;
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

export class CsvRowError extends RequestError {
  constructor(message: string, row: RosterFileRow, rowIndex: number, columnDisplayName?: string, showErrorPage = false) {
    // Offset by 2 (1 for being zero-based and 1 for the csv header row).
    const lineNumber = rowIndex + 2;

    let lineInfo: string;
    if (columnDisplayName) {
      lineInfo = `(Line ${lineNumber}, "${columnDisplayName}")`;
    } else {
      lineInfo = `(Line ${lineNumber})`;
    }

    super(`${lineInfo}\n${message}`, 'UnprocessableEntity', 422, showErrorPage);

    Error.captureStackTrace(this, CsvRowError);
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
