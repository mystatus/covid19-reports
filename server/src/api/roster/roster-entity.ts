import {
  BaseEntity, BeforeInsert, BeforeUpdate,
  Column,
  EntityTarget,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  BadRequestError,
  RequiredColumnError,
} from '../../util/error-types';
import { getColumnMaxLength } from '../../util/typeorm-utils';
import {
  dateFromString,
  getOptionalValue,
  getRequiredValue,
} from '../../util/util';
import { Unit } from '../unit/unit.model';
import {
  CustomColumns,
  edipiColumnDisplayName,
  RosterColumnInfo,
  RosterColumnType,
  RosterColumnValue,
  RosterEntryData,
  RosterFileRow,
} from './roster.types';
import { formatPhoneNumber } from '../../util/string-utils';

/**
 * This class serves as the base entity for both Roster and RosterHistory.  This allows both Roster and RosterHistory
 * to have columns, functions, and constraints that aren't shared with each other while still retaining a shared set of
 * columns.
 */
export abstract class RosterEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Unit, unit => unit.id, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  unit!: Unit;

  @Column({
    length: 10,
  })
  edipi!: string;

  @Column({
    length: 100,
  })
  firstName!: string;

  @Column({
    length: 100,
  })
  lastName!: string;

  @Column({
    length: 20, nullable: true,
  })
  phoneNumber!: string;

  // The get/set column functions abstract this json data structure away and treat
  // custom columns as if they were directly on the model.
  // This column should ONLY be modified in the setColumn() function.
  @Column('json', {
    nullable: false,
    default: '{}',
  })
  customColumns!: CustomColumns;

  abstract getEntityTarget(): EntityTarget<any>;

  toData(): RosterEntryData {
    if (!this.unit) {
      throw new Error('You must have the roster entry unit loaded to convert to data.');
    }

    const entryData: RosterEntryData = {
      edipi: this.edipi,
      unit: this.unit.id,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
    };

    for (const columnName of Object.keys(this.customColumns ?? {})) {
      entryData[columnName] = this.customColumns[columnName];
    }

    return entryData;
  }

  getColumnValue(column: RosterColumnInfo) {
    if (column.custom) {
      return this.customColumns?.[column.name];
    }

    return Reflect.get(this, column.name);
  }

  setColumnValue(column: RosterColumnInfo, value: RosterColumnValue | undefined) {
    const validValue = this.validateColumnValue(column, value);
    if (validValue === undefined) {
      return;
    }

    // Set the value.
    if (column.custom) {
      if (!this.customColumns) {
        this.customColumns = {};
      }
      this.customColumns[column.name] = validValue;
    } else {
      Reflect.set(this, column.name, validValue);
    }
  }

  setColumnValueFromData(column: RosterColumnInfo, data: RosterEntryData) {
    const expectedType = columnTypeToEntryDataType(column.type);

    // Get the column value from the data.
    let value: RosterColumnValue | undefined;
    if (column.required) {
      value = getRequiredValue(column.name, data, expectedType);
    } else {
      value = getOptionalValue(column.name, data, expectedType);
    }

    this.setColumnValue(column, value);
  }

  setColumnValueFromFileRow(column: RosterColumnInfo, row: RosterFileRow) {
    // Get the string value from the row data.
    let value: string | null | undefined;
    if (column.required) {
      value = getRequiredValue(column.displayName, row, 'string');
    } else {
      value = getOptionalValue(column.displayName, row, 'string');
    }

    // Convert empty strings to null.
    value = value || null;

    this.setColumnValue(column, value);
  }

  validateColumnValue(column: RosterColumnInfo, value: RosterColumnValue | undefined): RosterColumnValue | undefined {
    if (typeof value === 'string') {
      const maxLength = getColumnMaxLength(this.getEntityTarget(), column.name);
      if (maxLength) {
        if (isEdipiColumn(column) && value.length !== maxLength) {
          throw new Error(`"${column.displayName}" must be exactly ${maxLength} characters.`);
        }

        if (value.length > maxLength) {
          throw new Error(`"${column.displayName}" value exceeds max length of ${maxLength}.`);
        }
      }
    }

    // Ignore undefined values, unless this is a required column with no current value.
    if (value === undefined) {
      if (column.required && this.getColumnValue(column) !== undefined) {
        throw new RequiredColumnError(column.displayName);
      }

      return undefined;
    }

    // Don't allow non-updatable columns to be updated if they already have a value.
    if (!column.updatable && this.getColumnValue(column) !== undefined) {
      throw new Error(`"${column.displayName}" is not updatable.`);
    }

    // If this is a null or empty value, make sure it's not a required column.
    if (value === null || (typeof value === 'string' && value.length === 0)) {
      if (column.required) {
        throw new RequiredColumnError(column.displayName);
      }
    }

    // Convert string data into the type our model expects.
    if (typeof value === 'string' && column.type !== RosterColumnType.String) {
      switch (column.type) {
        case RosterColumnType.Number:
          value = +value;
          if (Number.isNaN(value)) {
            throw new BadRequestError(`"${column.displayName}" number value is invalid.`);
          }
          break;
        case RosterColumnType.Date:
        case RosterColumnType.DateTime:
          value = dateFromString(value, true)!.toISOString();
          break;
        case RosterColumnType.Boolean:
          value = (value === 'true');
          break;
        default:
          break;
      }
    }

    return value;
  }

  @BeforeInsert()
  @BeforeUpdate()
  formatPhoneNumber() {
    this.phoneNumber = formatPhoneNumber(this.phoneNumber);
  }

}

function columnTypeToEntryDataType(columnType: RosterColumnType) {
  // Get dates and enums as strings.
  switch (columnType) {
    case RosterColumnType.Date:
    case RosterColumnType.DateTime:
    case RosterColumnType.Enum:
      return 'string';
    default:
      return columnType;
  }
}

function isEdipiColumn(column: RosterColumnInfo) {
  return (column.displayName === edipiColumnDisplayName);
}

