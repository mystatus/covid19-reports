import {
  EntityTarget,
  getConnection,
} from 'typeorm';

export function getDatabaseErrorMessage(err: DatabaseError) {
  switch (err.code) {
    case '22001': {
      const maxLengthMatch = err.message.match(/\((\d.)\)/);
      const maxLength = parseInt(maxLengthMatch?.[1] ?? '');
      if (!Number.isNaN(maxLength)) {
        return `Value exceeds max length of ${maxLength} characters.`;
      }

      return 'Value is too long.';
    }
    default:
      return err.message;
  }
}

export function getColumnMetadata(entityType: EntityTarget<any>, columnName: string) {
  const entityMetadata = getConnection().getMetadata(entityType);
  return entityMetadata.columns.find(x => x.propertyName === columnName);
}

export function getColumnMaxLength(entityType: EntityTarget<any>, columnName: string) {
  const columnMetadata = getColumnMetadata(entityType, columnName);
  const maxLength = parseInt(columnMetadata?.length ?? '');
  return Number.isNaN(maxLength) ? undefined : maxLength;
}

interface DatabaseError extends Error {
  code: string
}
