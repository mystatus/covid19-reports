import {
  BaseEntity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  BadRequestError,
  RequiredColumnError,
} from '../../util/error-types';
import {
  BaseType,
  dateFromString,
  getOptionalValue,
  getRequiredValue,
} from '../../util/util';
import { Unit } from '../unit/unit.model';
import {
  CustomColumns,
  RosterColumnInfo,
  RosterColumnType,
  RosterColumnValue,
} from './roster.types';

/**
 * This class serves as the base entity for both Roster and RosterHistory.  This allows both Roster and RosterHistory
 * to have columns, functions, and constraints that aren't shared with each other while still retaining a shared set of
 * columns.
 */
export class RosterEntity extends BaseEntity {

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

  // The get/set column functions abstract this json data structure away and treat
  // custom columns as if they were directly on the model.
  // This column should ONLY be modified in the setColumn() function.
  @Column('json', {
    nullable: false,
    default: '{}',
  })
  customColumns!: CustomColumns;

  toData(): RosterEntryData {
    if (!this.unit) {
      throw new Error('You must have the roster entry unit loaded to convert to data.');
    }

    const entryData: RosterEntryData = {
      edipi: this.edipi,
      unit: this.unit.id,
      firstName: this.firstName,
      lastName: this.lastName,
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
    // Ignore undefined values, unless this is a required column with no current value.
    if (value === undefined) {
      if (column.required && this.getColumnValue(column) != null) {
        throw new RequiredColumnError(column.name);
      }

      return;
    }

    // Don't allow non-updatable columns to be updated if they already have a value.
    if (!column.updatable && this.getColumnValue(column) !== undefined) {
      throw new Error(`Column '${column.name}' is not updatable.`);
    }

    // If this is a null or empty value, make sure it's not a required column.
    if (value === null || (typeof value === 'string' && value.length === 0)) {
      if (column.required) {
        throw new RequiredColumnError(column.name);
      }
    }

    // Convert string data into the type our model expects.
    if (typeof value === 'string' && column.type !== RosterColumnType.String) {
      switch (column.type) {
        case RosterColumnType.Number:
          value = +value;
          if (Number.isNaN(value)) {
            throw new BadRequestError(`Number value for column '${column.name}' is invalid.`);
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

    // Set the value.
    if (column.custom) {
      if (!this.customColumns) {
        this.customColumns = {};
      }
      this.customColumns[column.name] = value;
    } else {
      Reflect.set(this, column.name, value);
    }
  }

  setColumnValueFromData(column: RosterColumnInfo, data: RosterEntryData) {
    // Get dates and enums as strings.
    let paramType: BaseType;
    switch (column.type) {
      case RosterColumnType.Date:
      case RosterColumnType.DateTime:
      case RosterColumnType.Enum:
        paramType = 'string';
        break;
      default:
        paramType = column.type;
    }

    // Get the column value from the data.
    let value: RosterColumnValue | undefined;
    if (column.required) {
      value = getRequiredValue(column.name, data, paramType);
    } else {
      value = getOptionalValue(column.name, data, paramType);
    }

    this.setColumnValue(column, value);
  }

  setColumnValueFromFileRow(column: RosterColumnInfo, row: RosterFileRow, edipiColumnName: string) {
    // Allow a custom edipi column name.
    const columnName = (column.name === 'edipi') ? edipiColumnName : column.name;

    // Get the string value from the row data.
    let value: string | null | undefined;
    if (column.required) {
      value = getRequiredValue(columnName, row, 'string', column.displayName);
    } else {
      value = getOptionalValue(columnName, row, 'string', column.displayName);
    }

    this.setColumnValue(column, value);
  }

}

export const baseRosterColumns: RosterColumnInfo[] = [
  {
    name: 'edipi',
    displayName: 'DoD ID',
    type: RosterColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: false,
  },
  {
    name: 'firstName',
    displayName: 'First Name',
    type: RosterColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  },
  {
    name: 'lastName',
    displayName: 'Last Name',
    type: RosterColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  },
];

export type RosterEntryData = {
  edipi: RosterEntity['edipi'],
  unit: number,
  firstName?: RosterEntity['firstName'],
  lastName?: RosterEntity['lastName'],
} & CustomColumns;

export type RosterFileRow = {
  [key: string]: string
};
