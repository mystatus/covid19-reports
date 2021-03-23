import { UserRole } from '../api/user/user-role.model';

export function getKibanaRoles(userRole: UserRole) {
  if (userRole.role.canManageWorkspace) {
    return 'kibana_admin';
  }

  return 'kibana_ro_strict';
}
