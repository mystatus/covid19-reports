import { EntityManager } from 'typeorm';
import { Org } from '../api/org/org.model';
import { RosterEntryData } from '../api/roster/roster.controller';
import { Roster } from '../api/roster/roster.model';
import { CustomColumnValue, RosterColumnInfo, RosterColumnType } from '../api/roster/roster.types';
import { Unit } from '../api/unit/unit.model';
import { Role } from '../api/role/role.model';
import { BadRequestError, NotFoundError } from './error-types';
import { BaseType, dateFromString, getOptionalParam, getRequiredParam } from './util';

export async function addRosterEntry(org: Org, role: Role, rosterEntryData: RosterEntryData, entityManager?: EntityManager) {
  const edipi = rosterEntryData.edipi as string;

  if (!rosterEntryData.unit) {
    throw new BadRequestError('A unit must be supplied when adding a roster entry.');
  }

  const unit = await Unit.findOne({
    relations: ['org'],
    where: {
      org: org.id,
      id: rosterEntryData.unit,
    },
  });
  if (!unit) {
    throw new NotFoundError(`Unit with ID ${rosterEntryData.unit} could not be found.`);
  }

  const rosterEntry = await Roster.findOne({
    where: {
      edipi,
      unit: unit.id,
    },
  });

  if (rosterEntry) {
    throw new BadRequestError('The individual is already in the roster.');
  }

  const entry = new Roster();
  entry.unit = unit;
  const columns = await Roster.getAllowedColumns(org, role);
  await setRosterParamsFromBody(org, entry, rosterEntryData, columns, true);
  if (entityManager) {
    return entityManager.save(entry);
  }
  return entry.save();
}

export async function setRosterParamsFromBody(org: Org, entry: Roster, body: RosterEntryData, columns: RosterColumnInfo[], newEntry: boolean = false) {
  for (const column of columns) {
    if (newEntry || column.updatable) {
      await getColumnFromBody(org, entry, body, column, newEntry);
    }
  }
}


async function getColumnFromBody(org: Org, roster: Roster, row: RosterEntryData, column: RosterColumnInfo, newEntry: boolean) {
  let objectValue: Date | CustomColumnValue | undefined;
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
  if (column.required && newEntry) {
    objectValue = getRequiredParam(column.name, row, paramType);
  } else {
    objectValue = getOptionalParam(column.name, row, paramType);
  }
  if (objectValue !== undefined) {
    if (objectValue === null && column.required) {
      throw new BadRequestError(`Required column '${column.name}' cannot be null.`);
    }
    if (column.custom) {
      if (!roster.customColumns) {
        roster.customColumns = {};
      }
      roster.customColumns[column.name] = objectValue;
    } else {
      if (objectValue !== null
          && (column.type === RosterColumnType.Date
            || column.type === RosterColumnType.DateTime)) {
        objectValue = dateFromString(`${objectValue}`);
      }
      Reflect.set(roster, column.name, objectValue !== null ? objectValue : undefined);
    }
  }
}
