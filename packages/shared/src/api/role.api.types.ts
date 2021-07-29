export type AddRoleBody = {
  name: string;
  description: string;
  workspaceIds?: number[] | null;
  allowedRosterColumns?: string[];
  allowedNotificationEvents?: string[];
  canManageGroup?: boolean;
  canManageRoster?: boolean;
  canManageWorkspace?: boolean;
  canViewRoster?: boolean;
  canViewMuster?: boolean;
  canViewPII?: boolean;
  canViewPHI?: boolean;
};

export type UpdateRoleBody = Partial<AddRoleBody>;
