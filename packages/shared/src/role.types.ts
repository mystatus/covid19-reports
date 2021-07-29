import { OrgSerialized } from './org.types';
import { UserRoleSerialized } from './user-role.types';
import { WorkspaceSerialized } from './workspace.types';

export type RoleSerialized = {
  id: number;
  name: string;
  description: string;
  org?: OrgSerialized;
  userRoles?: UserRoleSerialized[];
  workspaces?: WorkspaceSerialized[];
  allowedRosterColumns: string[];
  allowedNotificationEvents: string[];
  canManageGroup: boolean;
  canManageRoster: boolean;
  canViewRoster: boolean;
  canViewMuster: boolean;
  canViewPII: boolean;
  canViewPHI: boolean;
  canManageWorkspace: boolean;
};
