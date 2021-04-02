import { AppState } from '../store';

export namespace UserSelector {
  export const current = (state: AppState) => state.user;
  export const orgId = (state: AppState) => state.user.activeRole?.role.org?.id;
  export const org = (state: AppState) => state.user.activeRole?.role.org;
  export const workspaces = (state: AppState) => state.user.activeRole?.role.workspaces;
  export const favoriteDashboards = (state: AppState) => state.user.activeRole?.favoriteDashboards;
}
