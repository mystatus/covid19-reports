import { ApiRole } from '../models/api-response';
import { AppState } from '../store';

export namespace RoleSelector {
  export const all = (state: AppState): ApiRole[] => state.role.roles;
}
