export type AddRoleBody = {
  name: string;
  description: string;
  allowedRosterColumns?: string[];
  allowedNotificationEvents?: string[];
  canManageGroup?: boolean;
  canManageRoster?: boolean;
  canViewRoster?: boolean;
  canViewMuster?: boolean;
  canViewPII?: boolean;
  canViewPHI?: boolean;
};

export type UpdateRoleBody = Partial<AddRoleBody>;
