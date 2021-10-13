import { OrgSerialized } from './org.types';
import { UserRoleSerialized } from './user-role.types';

export type RoleSerialized = {
  id: number;
  name: string;
  description: string;
  org?: OrgSerialized;
  userRoles?: UserRoleSerialized[];
  allowedRosterColumns: string[];
  allowedNotificationEvents: string[];
  canManageGroup: boolean;
  canManageRoster: boolean;
  canViewRoster: boolean;
  canViewObservation: boolean;
  canViewMuster: boolean;
  canViewPII: boolean;
  canViewPHI: boolean;
};

export const rolePermissions = [
  'canManageGroup',
  'canManageRoster',
  'canViewRoster',
  'canViewObservation',
  'canViewMuster',
  'canViewPII',
  'canViewPHI',
] as const;

export type RolePermission = typeof rolePermissions[number];
