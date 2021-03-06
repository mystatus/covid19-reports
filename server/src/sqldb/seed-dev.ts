import { getManager } from 'typeorm';
import database from './sqldb';
import { Org } from '../api/org/org.model';
import { seedOrphanedRecords } from '../api/orphaned-record/orphaned-record.model.mock';
import { Role } from '../api/role/role.model';
import { RosterColumnType } from '../api/roster/roster.types';
import { User } from '../api/user/user.model';
import { Workspace } from '../api/workspace/workspace.model';
import { Roster } from '../api/roster/roster.model';
import { CustomRosterColumn } from '../api/roster/custom-roster-column.model';
import { Unit } from '../api/unit/unit.model';
import { env } from '../util/env';
import { Log } from '../util/log';
import { RosterHistory } from '../api/roster/roster-history.model';
import { defaultReportSchemas, ReportSchema } from '../api/report-schema/report-schema.model';
import {
  uniqueEdipi,
  uniquePhone,
} from '../util/test-utils/unique';

require('dotenv').config();

let orgCount = 0;
let unitCount = 0;

export default (async function() {
  if (!env.isDev) {
    throw new Error('You can only seed the database in a development environment.');
  }

  Log.info('Seeding database...');

  const connection = await database;

  // Create Group Admin
  const groupAdmin = User.create({
    edipi: uniqueEdipi(),
    firstName: 'Group',
    lastName: 'Admin',
    phone: uniquePhone(),
    email: `groupadmin@setest.com`,
    service: 'Space Force',
    isRegistered: true,
  });
  await groupAdmin.save();

  // Create Org 1 & 2 and their Users
  const { org: org1, rosterEntries: org1RosterEntries } = await generateOrg(groupAdmin, 5, 20);
  await generateOrg(groupAdmin, 5, 20);

  // Set the start date on each roster entry to some time in the past to help with repeatable testing
  await RosterHistory.createQueryBuilder()
    .update()
    .set({ timestamp: '2020-01-01 00:00:00' })
    .execute();

  // Create lots of orphaned records to catch possible UI issues.
  let orphanUnitCount = 0;
  for (let i = 0; i < 10; i++) {
    orphanUnitCount += 1;

    await seedOrphanedRecords(org1, {
      count: 100,
      customData: {
        unit: `Orphan Unit ${orphanUnitCount}`,
      },
    });

    // Create some orphaned records that have the same composite id.
    await seedOrphanedRecords(org1, {
      count: 3,
      customData: {
        edipi: uniqueEdipi(),
        unit: `Orphan Unit ${orphanUnitCount}`,
        phone: uniquePhone(),
      },
    });

    // Create some orphaned records for an individual in the roster.
    orphanUnitCount += 1;
    await seedOrphanedRecords(org1, {
      count: 3,
      customData: {
        edipi: org1RosterEntries[0].edipi,
        unit: `Orphan Unit ${orphanUnitCount}`,
        phone: uniquePhone(),
      },
    });
  }

  await connection.close();

  Log.info('Finished!');
}());

async function generateOrg(admin: User, numUsers: number, numRosterEntries: number) {
  orgCount += 1;

  const org = Org.create({
    name: `Group ${orgCount}`,
    description: `Group ${orgCount} for testing.`,
    contact: admin,
    indexPrefix: `testgroup${orgCount}`,
    reportingGroup: `test${orgCount}`,
    defaultMusterConfiguration: [],
  });
  await org.save();

  const reportSchemas = ReportSchema.create(defaultReportSchemas);
  for (const report of reportSchemas) {
    report.org = org;
  }
  await ReportSchema.save(reportSchemas);

  const customColumn = CustomRosterColumn.create({
    org,
    display: `My Custom Column ${orgCount}`,
    type: RosterColumnType.String,
    phi: false,
    pii: false,
    required: false,
  });
  await customColumn.save();

  const units: Unit[] = [];
  for (let i = 1; i <= 5; i++) {
    unitCount += 1;
    const unit = Unit.create({
      org,
      name: `Unit ${unitCount}`,
      musterConfiguration: [],
      includeDefaultConfig: true,
    });
    units.push(unit);
  }
  await Unit.save(units);

  const groupAdminRole = createGroupAdminRole(org);
  await groupAdminRole.save();
  await admin.addRole(getManager(), groupAdminRole, [], true);
  await admin.save();

  const groupUserRole = createGroupUserRole(org);
  groupUserRole.allowedRosterColumns.push(customColumn.name);
  await groupUserRole.save();

  for (let i = 0; i < numUsers; i++) {
    const edipi = uniqueEdipi();
    const edipiNum = parseInt(edipi);
    const user = User.create({
      edipi,
      firstName: `UserFirst${edipiNum}`,
      lastName: `UserLast${edipiNum}`,
      phone: uniquePhone(),
      email: `user${edipiNum}@setest.com`,
      service: 'Space Force',
      isRegistered: true,
    });
    await user.save();
    await user.addRole(getManager(), groupUserRole, [units[i % 5]], false);
  }

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
      unit: units[i % 5],
      customColumns,
    });
    rosterEntries.push(rosterEntry);
  }
  await Roster.save(rosterEntries);

  return { org, rosterEntries };
}

function createGroupAdminRole(org: Org, workspaces?: Workspace[]) {
  return Role.create({
    name: 'Admin',
    description: 'For managing the group.',
    org,
    allowedRosterColumns: ['*'],
    allowedNotificationEvents: ['*'],
    canManageGroup: true,
    canManageRoster: true,
    canManageWorkspace: true,
    canViewMuster: true,
    canViewPII: true,
    canViewRoster: true,
    workspaces,
  });
}

function createGroupUserRole(org: Org, workspaces?: Workspace[]) {
  return Role.create({
    name: 'User',
    description: `Basic role for all Group ${org.id} users.`,
    org,
    allowedRosterColumns: ['edipi', 'lastName'],
    allowedNotificationEvents: [],
    canViewRoster: true,
    canViewMuster: true,
    canViewPII: true,
    workspaces,
  });
}
