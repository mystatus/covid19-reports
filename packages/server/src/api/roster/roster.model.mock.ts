import { json2csvAsync } from 'json-2-csv';
import {
  uniqueEdipi,
  uniqueString,
} from '../../util/test-utils/unique';
import { Unit } from '../unit/unit.model';
import { Roster } from './roster.model';

export function mockRosterEntry(unit: Unit) {
  return Roster.create({
    unit,
    edipi: uniqueEdipi(),
    firstName: uniqueString(),
    lastName: uniqueString(),
    customColumns: {
      stuff: uniqueString(),
    },
  });
}

export function seedRosterEntry(unit: Unit) {
  return mockRosterEntry(unit).save();
}

export function seedRosterEntries(unit: Unit, options: {
  count: number;
}) {
  const { count } = options;

  const entries = [] as Roster[];
  for (let i = 0; i < count; i++) {
    entries.push(mockRosterEntry(unit));
  }

  return Roster.save(entries);
}

export function mockRosterUploadCsv(args: {
  unit: Unit;
  rosterCount: number;
}) {
  const { unit, rosterCount } = args;

  const rosterData = [] as any[];
  for (let i = 0; i < rosterCount; i++) {
    const entry = mockRosterEntry(unit);
    const entryData = {
      Unit: entry.unit.name,
      'DoD ID': entry.edipi,
      'First Name': entry.firstName,
      'Last Name': entry.lastName,
    } as any;

    for (const key of Object.keys(entry.customColumns)) {
      entryData[key] = entry.customColumns[key];
    }

    rosterData.push(entryData);
  }

  return json2csvAsync(rosterData);
}
