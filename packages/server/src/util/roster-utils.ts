import { EntityManager } from 'typeorm';
import {
  ColumnInfo,
  RosterEntryData,
} from '@covid19-reports/shared';
import { Org } from '../api/org/org.model';
import { Role } from '../api/role/role.model';
import { RosterHistory } from '../api/roster/roster-history.model';
import { Roster } from '../api/roster/roster.model';
import { Unit } from '../api/unit/unit.model';
import { UserRole } from '../api/user/user-role.model';
import { BadRequestError, NotFoundError } from './error-types';

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

  const allowedColumns = Roster.filterAllowedColumns(await Roster.getColumns(org), role);

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

  const allowedColumns = Roster.filterAllowedColumns(await Roster.getColumns(org), userRole.role);
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

export function getCsvHeaderForRosterColumn(column: ColumnInfo) {
  return column.displayName;
}

export function getCsvValueForRosterColumn(entry: RosterEntryData, column: ColumnInfo) {
  return entry[column.name] ?? '';
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
    roster: toRosterEntry(rostersFromDb),
    unitIds: getUnitIds(rostersFromDb),
    edipis: getEdipi(rostersFromDb),
  };
}

/**
 * The <strong><code>RosterEntry()</code></strong> function <strong>converts an array of
 * <code>Roster</code> entity data into a subset of such data.
 *
 * @param rosters The array of <code>Roster</code> entity
 */
export function toRosterEntry(rosters: Roster[]): RosterEntry[] {
  return rosters.map(roster => {
    return {
      edipi: roster.edipi,
      firstName: roster.firstName,
      lastName: roster.lastName,
      // This filed is to be implemented as part of a different task
      myCustomColumn1: 'tbd',
      unitId: roster.unit.id,
      phone: roster.phoneNumber,
    };
  });
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
  roster: RosterEntry[];
  unitIds: number[];
  edipis: string[];
};

export type RosterEntry = {
  edipi: string;
  firstName: string;
  lastName: string;
  unitId: number;
  phone?: string;
};
