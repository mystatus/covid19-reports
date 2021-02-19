import { json2csvAsync } from 'json-2-csv';
import { uniqueString } from '../../util/test-utils/unique';
import { Unit } from '../unit/unit.model';
import { Roster } from './roster.model';

export function mockRosterEntry(unit: Unit) {
  return Roster.create({
    unit,
    edipi: uniqueString(),
    firstName: uniqueString(),
    lastName: uniqueString(),
    customColumns: {
      stuff: uniqueString(),
    },
  });
}

export async function seedRosterEntry(unit: Unit) {
  return mockRosterEntry(unit).save();
}

export async function seedRosterEntries(args: {
  unit: Unit
  count: number
}) {
  const { unit, count } = args;

  const entries = [] as Roster[];
  for (let i = 0; i < count; i++) {
    const entry = await seedRosterEntry(unit);
    entries.push(entry);
  }

  return entries;
}

export function mockRosterUploadCsv(args: {
  unit: Unit
  rosterCount: number
}) {
  const { unit, rosterCount } = args;

  const rosterData = [] as any[];
  for (let i = 0; i < rosterCount; i++) {
    const entry = mockRosterEntry(unit);
    const entryData = {
      unit: entry.unit.name,
      edipi: entry.edipi,
      firstName: entry.firstName,
      lastName: entry.lastName,
    } as any;

    for (const key of Object.keys(entry.customColumns)) {
      entryData[key] = entry.customColumns[key];
    }

    rosterData.push(entryData);
  }

  return json2csvAsync(rosterData);
}
