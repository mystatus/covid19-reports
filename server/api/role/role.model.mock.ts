import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { Workspace } from '../workspace/workspace.model';
import { Role } from './role.model';

export function mockRole(org: Org, options?: {
  customData?: Partial<Role>
}) {
  const { customData } = options ?? {};

  return Role.create({
    name: uniqueString(),
    description: uniqueString(),
    org,
    ...customData,
  });
}

export function seedRole(org: Org, options?: {
  customData?: Partial<Role>
}) {
  return mockRole(org, options).save();
}

export function seedRoleBasicUser(org: Org, workspace?: Workspace) {
  return seedRole(org, {
    customData: {
      allowedRosterColumns: ['edipi', 'firstName', 'lastName'],
      allowedNotificationEvents: [],
      canViewRoster: true,
      canViewMuster: true,
      workspace,
    },
  });
}

export function seedRoleAdmin(org: Org, workspace?: Workspace) {
  return seedRole(org, {
    customData: {
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
    },
  });
}
