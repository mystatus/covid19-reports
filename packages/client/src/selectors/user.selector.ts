import { AppState } from '../store';

export namespace UserSelector {
  export const root = (state: AppState) => state.user;
  export const orgId = (state: AppState) => state.user.activeRole?.role.org?.id;
  export const org = (state: AppState) => state.user.activeRole?.role.org;
  export const role = (state: AppState) => state.user.activeRole?.role;
}
