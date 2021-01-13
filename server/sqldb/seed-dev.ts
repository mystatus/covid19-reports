import process from 'process';
import database from '.';
import { Org } from '../api/org/org.model';
import { Role } from '../api/role/role.model';
import { RosterColumnType } from '../api/roster/roster.types';
import { User } from '../api/user/user.model';
import { Workspace } from '../api/workspace/workspace.model';
import { Roster } from '../api/roster/roster.model';
import { CustomRosterColumn } from '../api/roster/custom-roster-column.model';
import { Unit } from '../api/unit/unit.model';

export default (async function() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('You can only seed the database in a development environment.');
  }

  console.log('Seeding database...');

  const connection = await database;

  // Create users
  const groupAdmin = new User();
  groupAdmin.edipi = '0000000001';
  groupAdmin.firstName = 'Group';
  groupAdmin.lastName = 'Admin';
  groupAdmin.phone = '123-456-7890';
  groupAdmin.email = 'groupadmin@statusengine.com';
  groupAdmin.service = 'Space Force';
  groupAdmin.isRegistered = true;
  await groupAdmin.save();

  await generateOrg(1, groupAdmin, 5, 20);
  await generateOrg(2, groupAdmin, 5, 20);

  await connection.close();
  console.log('Finished!');
}());

async function generateOrg(orgNum: number, admin: User, numUsers: number, numRosterEntries: number) {
  const org = new Org();
  org.name = `Test Group ${orgNum}`;
  org.description = `Group ${orgNum} for testing.`;
  org.contact = admin;
  org.indexPrefix = `testgroup${orgNum}`;
  await org.save();

  const customColumn = new CustomRosterColumn();
  customColumn.org = org;
  customColumn.name = 'myCustomColumn';
  customColumn.display = 'My Custom Column';
  customColumn.type = RosterColumnType.String;
  customColumn.phi = false;
  customColumn.pii = false;
  customColumn.required = false;
  await customColumn.save();

  const groupAdminRole = await createGroupAdminRole(org).save();
  admin.addRole(groupAdminRole, '*');
  await admin.save();

  let userRole = createUserRole(org);
  userRole.allowedRosterColumns.push(customColumn.name);
  userRole = await userRole.save();

  for (let i = 0; i < numUsers; i++) {
    const user = new User();
    user.edipi = `${orgNum}00000000${i}`;
    user.firstName = 'User';
    user.lastName = `${i}`;
    user.phone = randomPhoneNumber();
    user.email = `user${i}@org${orgNum}.com`;
    user.service = 'Space Force';
    user.addRole(userRole, 'unit1');
    user.isRegistered = true;
    await user.save();
  }

  const units: Unit[] = [];
  for (let i = 1; i <= 5; i++) {
    const unit = new Unit();
    unit.org = org;
    unit.name = `Unit ${i}`;
    unit.id = `unit${i}`;
    unit.musterConfiguration = [];
    units.push(await unit.save());
  }

  for (let i = 0; i < numRosterEntries; i++) {
    const rosterEntry = new Roster();
    rosterEntry.edipi = `${orgNum}${`${i}`.padStart(9, '0')}`;
    rosterEntry.firstName = 'Roster';
    rosterEntry.lastName = `Entry${i}`;
    // Ensure at least some roster entries are in unit 1.
    rosterEntry.unit = (i % 2 === 0) ? units[0] : units[randomNumber(1, 4)];
    rosterEntry.lastReported = new Date();
    const customColumns: any = {};
    customColumns[customColumn.name] = `custom column value`;
    rosterEntry.customColumns = customColumns;
    await rosterEntry.save();
  }

  return org;
}

function randomPhoneNumber() {
  return `${randomNumber(100, 999)}-${randomNumber(100, 999)}-${randomNumber(1000, 9999)}`;
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createGroupAdminRole(org: Org, workspace?: Workspace) {
  const role = new Role();
  role.name = 'Group Admin';
  role.description = 'For managing the group.';
  role.org = org;
  role.allowedRosterColumns = ['*'];
  role.allowedNotificationEvents = ['*'];
  role.canManageGroup = true;
  role.canManageRoster = true;
  role.canManageWorkspace = true;
  role.canViewMuster = true;
  role.canViewPII = true;
  role.canViewRoster = true;
  role.workspace = workspace;
  return role;
}

function createUserRole(org: Org, workspace?: Workspace) {
  const role = new Role();
  role.name = 'Group User';
  role.description = 'Basic role for all group users.';
  role.org = org;
  role.allowedRosterColumns = ['edipi', 'unit', 'rateRank', 'lastReported'];
  role.allowedNotificationEvents = [];
  role.canManageRoster = true;
  role.canViewRoster = true;
  role.canViewMuster = true;
  role.workspace = workspace;
  return role;
}
