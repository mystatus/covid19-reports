import { getManager } from 'typeorm';
import { RosterColumnType } from '@covid19-reports/shared';
import { Observation } from '../../api/observation/observation.model';
import { Org } from '../../api/org/org.model';
import { seedOrphanedRecords } from '../../api/orphaned-record/orphaned-record.model.mock';
import { Role } from '../../api/role/role.model';
import { User } from '../../api/user/user.model';
import { Workspace } from '../../api/workspace/workspace.model';
import { Roster } from '../../api/roster/roster.model';
import { CustomRosterColumn } from '../../api/roster/custom-roster-column.model';
import { Unit } from '../../api/unit/unit.model';
import { env } from '../env';
import { Log } from '../log';
import { RosterHistory, ChangeType } from '../../api/roster/roster-history.model';
import { defaultReportSchemas, ReportSchema } from '../../api/report-schema/report-schema.model';
import { seedOrg } from '../../api/org/org.model.mock';
import {
  seedRoleBasicUser,
  seedRoleAdmin,
} from '../../api/role/role.model.mock';
import { seedUserRole } from '../../api/user/user-role.model.mock';
import { seedUser } from '../../api/user/user.model.mock';
import {
  uniqueEdipi,
  uniquePhone,
} from './unique';

require('dotenv').config();

let orgCount = 0;
let unitCount = 0;


export async function seedOrgContactRoles() {
  const { org, contact } = await seedOrgContact();
  const roleAdmin = await seedRoleAdmin(org);
  const roleUser = await seedRoleBasicUser(org);
  await seedUserRole(contact, roleAdmin);

  return {
    contact,
    org,
    roleAdmin,
    roleUser,
  };
}

export async function seedOrgContact() {
  const contact = await seedUser();
  const org = await seedOrg(contact);

  return {
    contact,
    org,
  };
}

export async function seedAll() {
  if (!env.isDev && !env.isTest) {
    throw new Error('You can only seed the database in a development or test environment.');
  }

  Log.info('Seeding database...');

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

  const totalAppUsers = 5;
  const totalUnits = 5;
  const totalRosterEntries = 20;

  // Create Org 1 & 2 and their Users
  const orgData1 = await generateOrg(groupAdmin, totalAppUsers, totalRosterEntries, totalUnits);
  const orgData2 = await generateOrg(groupAdmin, totalAppUsers, totalRosterEntries, totalUnits);

  // Set the start date on each roster entry to some time in the past to help with repeatable testing
  await RosterHistory.createQueryBuilder()
    .update()
    .set({ timestamp: new Date('2020-01-01T08:00:00Z') })
    .execute();

  const rosterRemoved = RosterHistory.create({
    ...orgData1.rosterEntries[0],
    timestamp: new Date('2020-01-03T08:00:00Z'),
    changeType: ChangeType.Deleted,
  });
  rosterRemoved.id = orgData1.rosterEntries.length * orgCount + 1;
  await rosterRemoved.save();

  const added = RosterHistory.create({
    ...orgData1.rosterEntries[0],
    timestamp: new Date('2020-01-05T08:00:00Z'),
    changeType: ChangeType.Added,
  });
  // this offsets unit assignment see original assignment in generateOrg() method below.
  added.id = orgData1.rosterEntries.length * orgCount + 2;
  added.unit = orgData1.units[3];
  await added.save();

  // Create lots of orphaned records to catch possible UI issues.
  let orphanUnitCount = 0;
  for (let i = 0; i < 10; i++) {
    orphanUnitCount += 1;

    await seedOrphanedRecords(orgData1.org, {
      count: 100,
      customData: {
        unit: `Orphan Unit ${orphanUnitCount}`,
      },
    });

    // Create some orphaned records that have the same composite id.
    await seedOrphanedRecords(orgData1.org, {
      count: 3,
      customData: {
        edipi: uniqueEdipi(),
        unit: `Orphan Unit ${orphanUnitCount}`,
        phone: uniquePhone(),
      },
    });

    // Create some orphaned records for an individual in the roster.
    orphanUnitCount += 1;
    await seedOrphanedRecords(orgData1.org, {
      count: 3,
      customData: {
        edipi: orgData1.rosterEntries[0].edipi,
        unit: `Orphan Unit ${orphanUnitCount}`,
        phone: uniquePhone(),
      },
    });
  }

  Log.info('Finished!');
  return [orgData1, orgData2];
}

async function generateOrg(admin: User, numUsers: number, numRosterEntries: number, numUnits: number) {
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

  let reportSchemas = ReportSchema.create(defaultReportSchemas);
  reportSchemas = reportSchemas.concat(ReportSchema.create(defaultReportSchemas));
  for (let i = 0; i < reportSchemas.length; i++) {
    const report = reportSchemas[i];
    report.org = org;
    if (i > 0) {
      report.id += i.toString();
    }
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

  // Add Units
  const units: Unit[] = [];
  for (let i = 1; i <= numUnits; i++) {
    unitCount += 1;
    const unit = Unit.create({
      org,
      name: `Unit ${unitCount}`,
      musterConfiguration: [
        { days: 62, startTime: '00:00', timezone: 'America/Los_Angeles', durationMinutes: 120, reportId: reportSchemas[0].id },
        { startTime: '2020-01-02T02:00:00.000Z', timezone: 'America/Los_Angeles', durationMinutes: 120, reportId: reportSchemas[1].id },
      ],
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

  // Create users
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

  // Add roster entries
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
  await Roster.save(rosterEntries);

  // Insert observations per roster entry
  const observations: Observation[] = [];
  for (let i = 0; i < numRosterEntries; i++) {
    const observation1 = Observation.create();
    observation1.unit = 'Unit 1';
    observation1.reportSchema = reportSchemas[0];
    observation1.timestamp = new Date('2020-01-02T08:00:00Z');
    observation1.documentId = `DocumentId_${i}`;
    observation1.edipi = rosterEntries[i].edipi;
    observations.push(observation1);

    const observation2 = Observation.create();
    observation2.unit = 'Unit 1';
    observation2.reportSchema = reportSchemas[1];
    observation2.timestamp = new Date('2020-01-02T03:00:00Z');
    observation2.documentId = `DocumentId_${i}`;
    observation2.edipi = rosterEntries[i].edipi;
    observations.push(observation2);
  }
  await Observation.save(observations);

  return { org, rosterEntries, units, observations };
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
