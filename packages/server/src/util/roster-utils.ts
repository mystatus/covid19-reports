import { EntityManager } from 'typeorm';
import {
  RosterColumnInfo,
  RosterEntryData,
} from '@covid19-reports/shared';
import { Org } from '../api/org/org.model';
import { Role } from '../api/role/role.model';
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

export async function editRosterEntry(org: Org, userRole: UserRole, entryId: number, entryData: RosterEntryData, manager: EntityManager) {
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

export function getRosterHistoryForIndividual(edipi: string, unitId: number) {
  return RosterHistory.createQueryBuilder('rh')
    .where('rh.unit_id = :unitId', { unitId })
    .andWhere('rh.edipi = :edipi', { edipi })
    .addOrderBy('rh.timestamp', 'DESC')
    .addOrderBy('rh.change_type', 'DESC')
    .getMany();
}

export function getCsvHeaderForRosterColumn(column: RosterColumnInfo) {
  return column.displayName;
}

export function getCsvValueForRosterColumn(entry: RosterEntryData, column: RosterColumnInfo) {
  return entry[column.name] ?? '';
}

export async function saveRosterPhoneNumber(edipi: string, phoneNumber: string, entityManager: EntityManager) {
  // The same edipi can potentially be in the roster table multiple times
  // since an individual can be on multiple units.
  // This is not however intentional but we will handle this case.
  const rosters: Roster[] = await Roster.find({ where: { edipi } });
  if (!rosters || rosters.length === 0) {
    throw new BadRequestError(`Unable to find ${edipi} in Roster`);
  }

  for (const roster of rosters) {
    roster.phoneNumber = phoneNumber;
    await entityManager.save(roster);
  }
}

/**
 * The <strong><code>getRosterWithUnitsAndEdipis()</code></strong> function <strong> returns roster information
 * for the given unit and organization</strong>.
 *
 * @param unitId The unit ID. If missing then roster information is returned for all units.
 * @param orgId The organization ID
 */
export async function getRosterWithUnitsAndEdipis(unitId: string, orgId: number): Promise<RosterWithUnitsAndEdipis> {
  const rostersFromDb = await getRosters(unitId, orgId);
  return {
    roster: rostersFromDb,
    unitIds: getUnitIds(rostersFromDb),
    edipis: getEdipi(rostersFromDb),
  };
}

async function getRosters(unitId: string, orgId: number): Promise<Roster[]> {
  let rosters;
  if (unitId) {
    rosters = await Roster.find({ relations: ['unit', 'unit.org'], where: { unit: unitId } });
  } else {
    rosters = await Roster.find({ relations: ['unit', 'unit.org'] });
  }
  return rosters.filter(roster => roster.unit.org!.id === orgId);
}

/** Get an array of unique Unit IDs */
function getUnitIds(rosters: Roster[]): number[] {
  return Array.from(new Set(rosters.map(r => r.unit.id)));
}

/** Get an array of unique edipis */
function getEdipi(rosters: Roster[]): string[] {
  return Array.from(new Set(rosters.map(r => r.edipi)));
}

type RosterWithUnitsAndEdipis = {
  roster: Roster[];
  unitIds: number[];
  edipis: string[];
};
