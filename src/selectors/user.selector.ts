import { ApiOrg } from '../models/api-response';
import { AppState } from '../store';

export namespace UserSelector {
  export const orgId = (state: AppState): number | undefined => state.user.activeRole?.org?.id;
  export const org = (state: AppState): ApiOrg | undefined => state.user.activeRole?.org;
}
