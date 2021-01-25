import process from 'process';
import { getManager, EntityManager } from 'typeorm';
import database from '.';
import { Org } from '../api/org/org.model';
import { Role } from '../api/role/role.model';
import { RosterColumnType } from '../api/roster/roster.types';
import { User } from '../api/user/user.model';
import { Workspace } from '../api/workspace/workspace.model';
import { Roster } from '../api/roster/roster.model';
import { CustomRosterColumn } from '../api/roster/custom-roster-column.model';
import { Unit } from '../api/unit/unit.model';

require('dotenv').config();

export default (async function() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('You can only seed the database in a development environment.');
  }

  console.log('Seeding database...');

  const connection = await database;

  await getManager().transaction(async transactionalEntityManager => {

    // Create Group Admin
    let groupAdmin = transactionalEntityManager.create<User>('User', {
      edipi: '0000000001',
      firstName: 'Group',
      lastName: 'Admin',
      phone: '123-456-7890',
      email: 'groupadmin@statusengine.com',
      service: 'Space Force',
      isRegistered: true,
    });
    groupAdmin = await transactionalEntityManager.save(groupAdmin);

    // Create Org 1 & 2 and their Users
    await generateOrg(transactionalEntityManager, 1, groupAdmin, 5, 20);
    await generateOrg(transactionalEntityManager, 2, groupAdmin, 5, 20);
  });

  await connection.close();
  console.log('Finished!');
}());


async function generateOrg(entityManager: EntityManager, orgNum: number, admin: User, numUsers: number, numRosterEntries: number) {
  let org = entityManager.create<Org>('Org', {
    name: `Test Group ${orgNum}`,
    description: `Group ${orgNum} for testing.`,
    contact: admin,
    indexPrefix: `testgroup${orgNum}`,
    defaultMusterConfiguration: [],
  });
  org = await entityManager.save(org);

  let customColumn = entityManager.create<CustomRosterColumn>('CustomRosterColumn', {
    org,
    name: 'myCustomColumn',
    display: `My Custom Column : Group ${orgNum}`,
    type: RosterColumnType.String,
    phi: false,
    pii: false,
    required: false,
  });
  customColumn = await entityManager.save(customColumn);

  let groupAdminRole = createGroupAdminRole(entityManager, org);
  groupAdminRole = await entityManager.save(groupAdminRole);
  await admin.addRole(entityManager, groupAdminRole, '*');
  admin = await entityManager.save(admin);

  let groupUserRole = createGroupUserRole(entityManager, org);
  groupUserRole.allowedRosterColumns.push(customColumn.name);
  groupUserRole = await entityManager.save(groupUserRole);

  for (let i = 0; i < numUsers; i++) {
    let user = entityManager.create<User>('User', {
      edipi: `${orgNum}00000000${i}`,
      firstName: 'User',
      lastName: `${i}`,
      phone: randomPhoneNumber(),
      email: `user${i}@org${orgNum}.com`,
      service: 'Space Force',
      isRegistered: true,
    });
    user = await entityManager.save(user);
    await user.addRole(entityManager, groupUserRole, 'unit1');
  }

  const units: Unit[] = [];
  for (let i = 1; i <= 5; i++) {
    let unit = entityManager.create<Unit>('Unit', {
      org,
      name: `Unit ${i} : Group ${orgNum}`,
      id: `unit${i}`,
      musterConfiguration: [],
    });
    unit = await entityManager.save(unit);
    units.push(unit);
  }

  for (let i = 0; i < numRosterEntries; i++) {
    const customColumns: any = {};
    customColumns[customColumn.name] = `custom column value`;
    const rosterEntry = entityManager.create<Roster>('Roster', {
      edipi: `${orgNum}${`${i}`.padStart(9, '0')}`,
      firstName: 'Roster',
      lastName: `Entry${i}`,
      unit: (i % 2 === 0) ? units[0] : units[randomNumber(1, 4)], // Ensure at least some roster entries are in unit 1.
      lastReported: new Date(),
      customColumns,
    });
    await entityManager.save(rosterEntry);
  }

  return org;
}

function randomPhoneNumber() {
  return `${randomNumber(100, 999)}-${randomNumber(100, 999)}-${randomNumber(1000, 9999)}`;
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createGroupAdminRole(entityManager: EntityManager, org: Org, workspace?: Workspace) {
  const role = entityManager.create<Role>('Role', {
    name: `Group Admin : Group ${org.id}`,
    description: 'For managing the group.',
    org,
    defaultIndexPrefix: '*',
    allowedRosterColumns: ['*'],
    allowedNotificationEvents: ['*'],
    canManageGroup: true,
    canManageRoster: true,
    canManageWorkspace: true,
    canViewMuster: true,
    canViewPII: true,
    canViewRoster: true,
    workspace,
  });
  return role;
}

function createGroupUserRole(entityManager: EntityManager, org: Org, workspace?: Workspace) {
  const role = entityManager.create<Role>('Role', {
    name: `Group User : Group ${org.id}`,
    description: `Basic role for all Group ${org.id} users.`,
    org,
    defaultIndexPrefix: 'unit1',
    allowedRosterColumns: ['edipi', 'unit', 'rateRank', 'lastReported'],
    allowedNotificationEvents: [],
    canManageRoster: true,
    canViewRoster: true,
    canViewMuster: true,
    workspace,
  });
  return role;
}
