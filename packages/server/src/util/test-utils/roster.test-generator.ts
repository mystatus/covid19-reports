import { CustomRosterColumn } from '../../api/roster/custom-roster-column.model';
import { Unit } from '../../api/unit/unit.model';
import { Roster } from '../../api/roster/roster.model';
import { uniqueEdipi } from './unique';
import { getCustomRosterColumnTestData } from './custom-roster-column.test-generator';
import { getOrgTestData } from './org-test-generator';
import { getAdminUserTestData } from './user.test-generator';
import { getUnitsTestData } from './unit.test-generator';
import { getReportSchemaTestData } from './report-schema.test-generator';

export function getRosterTestData(numRosterEntries: number, customColumn: CustomRosterColumn, units: Unit[], numUnits: number) {
  const rosterEntries: Roster[] = [];
  for (let i = 0; i < numRosterEntries; i++) {
    const customColumns: any = {};
    customColumns[customColumn.name] = `custom column value`;
    const edipi = uniqueEdipi();
    const edipiNum = parseInt(edipi);
    const rosterEntry = Roster.create({
      edipi,
      firstName: `RosterFirst${edipiNum}`,
      lastName: `RosterLast${edipiNum}`,
      unit: units[i % numUnits],
      customColumns,
    });
    rosterEntries.push(rosterEntry);
  }
  return rosterEntries;
}

export function getRosterTestDataSimple(numOfRosterEntries: number, numOfUnits: number, customColumnOrgCount: number) {
  const orgCount = 1;
  const org = getOrgTestData(getAdminUserTestData(), orgCount);
  return getRosterTestData(
    numOfRosterEntries,
    getCustomRosterColumnTestData(org, customColumnOrgCount),
    getUnitsTestData(numOfUnits, org, getReportSchemaTestData(org)),
    numOfUnits,
  );
}
