import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { Workspace } from '../workspace/workspace.model';
import { Role } from './role.model';

export async function seedRole(org: Org, customData?: Partial<Role>) {
  const role = Role.create({
    name: uniqueString(),
    description: uniqueString(),
    org,
    ...customData,
  });

  return Role.save(role);
}

export async function seedRoleBasicUser(org: Org, workspace?: Workspace) {
  return seedRole(org, {
    allowedRosterColumns: ['edipi', 'firstName', 'lastName'],
    allowedNotificationEvents: [],
    canViewRoster: true,
    canViewMuster: true,
    workspace,
  });
}

export async function seedRoleAdmin(org: Org, workspace?: Workspace) {
  return seedRole(org, {
    allowedRosterColumns: ['*'],
    allowedNotificationEvents: ['*'],
    canManageGroup: true,
    canManageRoster: true,
    canManageWorkspace: true,
    canViewRoster: true,
    canViewMuster: true,
    canViewPII: true,
    canViewPHI: true,
    workspace,
  });
}
