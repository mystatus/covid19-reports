import { CustomRosterColumn } from '../../../api/roster/custom-roster-column.model';
import { Unit } from '../../../api/unit/unit.model';
import { Roster } from '../../../api/roster/roster.model';
import { uniqueEdipi } from '../unique';
import { customRosterColumnTestData } from './custom-roster-column-generator';
import { orgTestData } from './org-generator';
import { adminUserTestData } from './user-generator';
import { unitsTestData } from './unit-generator';
import { reportSchemaTestData } from './report-schema-generator';

export async function rosterTestData(numRosterEntries: number, customColumn: CustomRosterColumn, units: Unit[], numUnits: number) {
  const rosterEntries: Roster[] = [];
  const batch: Roster[] = [];
  for (let i = 0; i < numRosterEntries; i++) {
    const customColumns: any = {};
    customColumns[customColumn.name] = `custom column value`;
    const edipi = uniqueEdipi();
    const edipiNum = parseInt(edipi);
    const rosterEntry = Roster.create({
      edipi,
      firstName: `RosterFirst${edipiNum}`,
      lastName: `RosterLast${edipiNum}`,
      org: units[i % numUnits].org,
      unit: units[i % numUnits],
      phoneNumber: '1234567890',
      customColumns,
    });
    batch.push(rosterEntry);
    if (batch.length > 100) {
      await Roster.save(batch);
      rosterEntries.push(...batch);
      batch.splice(0, batch.length);
    }
  }
  if (batch.length > 0) {
    await Roster.save(batch);
    rosterEntries.push(...batch);
  }
  return rosterEntries;
}

export function rosterTestDataSimple(numOfRosterEntries: number, numOfUnits: number, customColumnOrgCount: number) {
  const orgCount = 1;
  const unitsNameStartIndex = 1;
  const org = orgTestData(adminUserTestData(), orgCount);
  return rosterTestData(
    numOfRosterEntries,
    customRosterColumnTestData(org, customColumnOrgCount),
    unitsTestData(numOfUnits, unitsNameStartIndex, org),
    numOfUnits,
  );
}
