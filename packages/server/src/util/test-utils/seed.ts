import _ from 'lodash';
import moment from 'moment-timezone';
import { getManager } from 'typeorm';
import { MusterStatus } from '@covid19-reports/shared';
import { Observation } from '../../api/observation/observation.model';
import { Org } from '../../api/org/org.model';
import { seedOrphanedRecords } from '../../api/orphaned-record/orphaned-record.model.mock';
import { Role } from '../../api/role/role.model';
import { User } from '../../api/user/user.model';
import { Workspace } from '../../api/workspace/workspace.model';
import { Unit } from '../../api/unit/unit.model';
import { env } from '../env';
import { Log } from '../log';
import { ChangeType, RosterHistory } from '../../api/roster/roster-history.model';
import { ReportSchema } from '../../api/report-schema/report-schema.model';
import { seedOrg } from '../../api/org/org.model.mock';
import { seedRoleAdmin, seedRoleBasicUser } from '../../api/role/role.model.mock';
import { seedUserRole } from '../../api/user/user-role.model.mock';
import { seedUser } from '../../api/user/user.model.mock';
import { resetUniqueEdipiGenerator, uniqueEdipi, uniquePhone } from './unique';
import { rosterTestData } from './data/roster-generator';
import { customRosterColumnTestData } from './data/custom-roster-column-generator';
import { unitsTestData } from './data/unit-generator';
import { orgTestData } from './data/org-generator';
import { adminUserTestData } from './data/user-generator';
import { reportSchemaTestData } from './data/report-schema-generator';
import { SavedFilter } from '../../api/saved-filter/saved-filter.model';
import { MusterConfiguration } from '../../api/muster/muster-config.model';
import { MusterFilter } from '../../api/muster/muster-filter.model';
import { getMusterWindows } from '../muster-utils';

require('dotenv').config();

let orgCount = 0;

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

  orgCount = 0;
  resetUniqueEdipiGenerator();

  // Create Group Admin
  const adminUser = adminUserTestData();
  await adminUser.save();

  const totalAppUsers = 5;
  const totalUnits = 5;
  const totalRosterEntries = 20;

  // Create Org 1 & 2 and their Users
  const orgData1 = await generateOrg(adminUser, totalAppUsers, totalRosterEntries, totalUnits, 1);
  const orgData2 = await generateOrg(adminUser, totalAppUsers, totalRosterEntries, totalUnits, 100);
  // Create another Org with the same unit names as orgData1 for testing this edge case
  await generateOrg(adminUser, totalAppUsers, totalRosterEntries, totalUnits, 1);

  // Set the start date on each roster entry to some time in the past to help with repeatable testing
  await RosterHistory.createQueryBuilder()
    .update()
    .set({ timestamp: new Date('2020-01-01T08:00:00Z') })
    .execute();

  orgData1.rosterEntries[0].unit = orgData1.units[3];
  await orgData1.rosterEntries[0].save();

  await RosterHistory.createQueryBuilder()
    .update()
    .set({ timestamp: new Date('2020-01-05T08:00:00Z') })
    .where('change_type = :changeType', { changeType: ChangeType.Changed })
    .execute();

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

async function generateOrg(admin: User, numUsers: number, numRosterEntries: number, numUnits: number, unitsNameStartIndex: number) {
  orgCount += 1;
  const org = orgTestData(admin, orgCount);
  await org.save();
  const reportSchemas = reportSchemaTestData(org);
  await ReportSchema.save(reportSchemas);
  const customColumn = customRosterColumnTestData(org, orgCount);
  await customColumn.save();

  // Add Units
  const units = unitsTestData(numUnits, unitsNameStartIndex, org, reportSchemas);
  await Unit.save(units);

  const groupAdminRole = createGroupAdminRole(org);
  await groupAdminRole.save();
  await admin.addRole(getManager(), groupAdminRole, [], true);
  await admin.save();

  const groupUserRole = createGroupUserRole(org);
  groupUserRole.allowedRosterColumns.push(customColumn.name);
  await groupUserRole.save();

  // Add saved filters
  const filters = [];
  for (const unit of units) {
    const filter = SavedFilter.create({
      org,
      name: unit.name,
      entityType: 'roster',
      config: {
        unit: { op: '=', value: unit.id, expression: '', expressionEnabled: false },
      },
    });
    filters.push(await filter.save());
  }

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
  const rosterEntries = await rosterTestData(numRosterEntries, customColumn, units, numUnits);

  // Insert observations per roster entry
  const observations: Observation[] = [];
  const rosterEntriesByUnit = _.groupBy(rosterEntries, entry => entry.unit.name);

  // Add muster configurations
  const recurringMusterConfig = await MusterConfiguration.create({
    org,
    days: 62,
    startTime: '00:00',
    timezone: 'America/Los_Angeles',
    durationMinutes: 120,
    reportSchema: reportSchemas[0],
  }).save();

  let musterWindows = getMusterWindows(
    org,
    recurringMusterConfig,
    moment('2020-01-01T00:00:00Z').valueOf(),
    moment('2020-01-07T12:00:00Z').valueOf(),
  );

  const nonReportRate = 4; // 1 out of 4 reports will be non-reporting
  let reportCount = 0;

  // Add some units to the muster config
  for (let i = 0; i < numUnits; i += 2) {
    await MusterFilter.create({
      musterConfig: recurringMusterConfig,
      filter: filters[i],
      filterParams: {},
    }).save();

    // Add observations for unit
    const unitRoster = rosterEntriesByUnit[units[i].name];
    for (const roster of unitRoster) {
      const rosterHistoryEntry = await RosterHistory.findOne({
        where: {
          edipi: roster.edipi,
        },
      });
      for (const window of musterWindows) {
        // Create custom column info for the observations
        const customColumns = {
          Affiliation: 'test',
          TalkToSomeone: true,
          Symptoms: 'cough, fever',
          TemperatureFarenheit: 102,
          Score: 20,
          Category: 'high',
        };

        observations.push(Observation.create({
          unit: units[i].name,
          reportSchema: reportSchemas[0],
          timestamp: new Date(window.startTimestamp),
          documentId: `DocumentId_${roster.edipi}_${window.id}`,
          edipi: roster.edipi,
          musterStatus: ((reportCount % nonReportRate) === 0) ? MusterStatus.NON_REPORTING : MusterStatus.ON_TIME,
          musterConfiguration: recurringMusterConfig,
          musterWindowId: window.id,
          rosterHistoryEntry,
          customColumns,
        }));
        reportCount += 1;
      }
      await Observation.save(observations);
      observations.splice(0, observations.length);
    }
  }

  const oneTimeMusterConfig = await MusterConfiguration.create({
    org,
    days: null,
    startTime: '2020-01-02T02:00:00Z',
    timezone: 'America/Los_Angeles',
    durationMinutes: 120,
    reportSchema: reportSchemas[1],
  }).save();
  musterWindows = getMusterWindows(
    org,
    oneTimeMusterConfig,
    moment('2020-01-01T00:00:00Z').valueOf(),
    moment('2020-01-07T12:00:00Z').valueOf(),
  );
  // Add some units to the muster config
  for (let i = 1; i < numUnits; i += 2) {
    await MusterFilter.create({
      musterConfig: oneTimeMusterConfig,
      filter: filters[i],
      filterParams: {},
    }).save();

    // Add observations for unit
    const unitRoster = rosterEntriesByUnit[units[i].name];
    for (const roster of unitRoster) {
      const rosterHistoryEntry = await RosterHistory.findOne({
        where: {
          edipi: roster.edipi,
        },
      });
      for (const window of musterWindows) {
        observations.push(Observation.create({
          unit: units[i].name,
          reportSchema: reportSchemas[1],
          timestamp: new Date(window.startTimestamp),
          documentId: `DocumentId_${roster.edipi}_${window.id}`,
          edipi: roster.edipi,
          musterStatus: MusterStatus.ON_TIME,
          musterConfiguration: oneTimeMusterConfig,
          musterWindowId: window.id,
          rosterHistoryEntry,
        }));
      }
      await Observation.save(observations);
      observations.splice(0, observations.length);
    }
  }

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
