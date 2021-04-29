import { EntityManager } from 'typeorm';
import { Org } from '../api/org/org.model';
import { Role } from '../api/role/role.model';
import {
  RosterEntity,
  RosterEntryData,
} from '../api/roster/roster-entity';
import { RosterHistory } from '../api/roster/roster-history.model';
import { Roster } from '../api/roster/roster.model';
import { Unit } from '../api/unit/unit.model';
import { UserRole } from '../api/user/user-role.model';
import {
  BadRequestError,
  NotFoundError,
} from './error-types';

export async function addRosterEntry(org: Org, role: Role, entryData: RosterEntryData, manager: EntityManager) {
  const edipi = entryData.edipi as string;

  if (!entryData.unit) {
    throw new BadRequestError('A unit must be supplied when adding a roster entry.');
  }

  const unit = await Unit.findOne({
    relations: ['org'],
    where: {
      org: org.id,
      id: entryData.unit,
    },
  });

  if (!unit) {
    throw new NotFoundError(`Unit with ID ${entryData.unit} could not be found.`);
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

  const allowedColumns = await Roster.getAllowedColumns(org, role);
  for (const column of allowedColumns) {
    entry.setColumnValueFromData(column, entryData);
  }

  return manager.save(entry);
}

export async function editRosterEntry(org: Org, userRole: UserRole, entryId: RosterEntity['id'], entryData: RosterEntryData, manager: EntityManager) {
  const { unit: unitId } = entryData;

  let entry = await Roster.findOne({
    relations: ['unit'],
    where: {
      id: entryId,
    },
  });

  if (!entry) {
    throw new Error(`Unable to find roster entry with id: ${entryId}`);
  }

  if (unitId && unitId !== entry.unit!.id) {
    // If the unit changed, delete the individual from the old unit's roster.
    const unit = await userRole.getUnit(unitId);
    if (!unit) {
      throw new NotFoundError(`Unit with ID ${unitId} could not be found.`);
    }

    const oldEntry = entry;
    entry = oldEntry.clone();
    entry.unit = unit;

    await manager.delete(Roster, oldEntry.id);
  }

  const allowedColumns = await Roster.getAllowedColumns(org, userRole.role);
  for (const column of allowedColumns) {
    if (entryData[column.name] === undefined) {
      continue;
    }

    if (column.updatable) {
      entry.setColumnValueFromData(column, entryData);
    }
  }

  return manager.save(entry);
}

export async function getRosterHistoryForIndividual(edipi: string, unitId: number) {
  return RosterHistory.createQueryBuilder('rh')
    .where('rh.unit_id = :unitId', { unitId })
    .andWhere('rh.edipi = :edipi', { edipi })
    .addOrderBy('rh.timestamp', 'DESC')
    .addOrderBy('rh.change_type', 'DESC')
    .getMany();
}
