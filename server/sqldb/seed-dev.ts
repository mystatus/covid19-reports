import process from 'process';
import { EntityManager, getManager } from 'typeorm';
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
    const groupAdmin = transactionalEntityManager.create<User>('User', {
      edipi: '0000000001',
      firstName: 'Group',
      lastName: 'Admin',
      phone: '123-456-7890',
      email: 'groupadmin@statusengine.com',
      service: 'Space Force',
      isRegistered: true,
    });
    transactionalEntityManager.save(groupAdmin);

    // Create Org 1 & 2 and their Users
    await generateOrg(transactionalEntityManager, 1, groupAdmin, 5, 20);
    await generateOrg(transactionalEntityManager, 2, groupAdmin, 5, 20);
  });

  await connection.close();
  console.log('Finished!');
}());

async function generateOrg(entityManager: EntityManager, orgNum: number, admin: User, numUsers: number, numRosterEntries: number) {
  const org = entityManager.create<Org>('Org', {
    name: `Test Group ${orgNum}`,
    description: `Group ${orgNum} for testing.`,
    contact: admin,
    indexPrefix: `testgroup${orgNum}`,
  });
  await entityManager.save<Org>('Org', org);

  const customColumn = entityManager.create<CustomRosterColumn>('CustomRosterColumn', {
    org,
    name: 'myCustomColumn',
    display: 'My Custom Column',
    type: RosterColumnType.String,
    phi: false,
    pii: false,
    required: false,
  });
  await entityManager.save<CustomRosterColumn>('CustomRosterColumn', customColumn);

  const groupAdminRole = createGroupAdminRole(entityManager, org);
  await entityManager.save<Role>('Role', groupAdminRole);
  await admin.addRole(entityManager, groupAdminRole, '*');
  await entityManager.save<User>('User', admin);

  let userRole = createUserRole(entityManager, org);
  userRole.allowedRosterColumns.push(customColumn.name);
  userRole = await entityManager.save<Role>('Role', userRole);

  for (let i = 0; i < numUsers; i++) {
    const user = entityManager.create<User>('User', {
      edipi: `${orgNum}00000000${i}`,
      firstName: 'User',
      lastName: `${i}`,
      phone: randomPhoneNumber(),
      email: `user${i}@org${orgNum}.com`,
      service: 'Space Force',
      isRegistered: true,
    });
    await user.addRole(entityManager, userRole, 'unit1');
    await entityManager.save<User>('User', user);
  }

  const units: Unit[] = [];
  for (let i = 1; i <= 5; i++) {
    const unit = entityManager.create<Unit>('Unit', {
      org: org,
      name: `Unit ${i}`,
      id: `unit${i}`,
      musterConfiguration: [],
    });
    units.push(await entityManager.save<Unit>('Unit', unit));
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
    await entityManager.save<Roster>('Roster', rosterEntry);
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
  return entityManager.create<Role>('Role', {
    name: 'Group Admin',
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
}

function createUserRole(entityManager: EntityManager, org: Org, workspace?: Workspace) {
  return entityManager.create<Role>('Role', {
    name: 'Group User',
    description: 'Basic role for all group users.',
    org,
    defaultIndexPrefix: 'unit1',
    allowedRosterColumns: ['edipi', 'unit', 'rateRank', 'lastReported'],
    allowedNotificationEvents: [],
    canManageRoster: true,
    canViewRoster: true,
    canViewMuster: true,
    workspace,
  });
}