import { Role } from '../actions/role.actions';
import { ApiRole } from '../models/api-response';
import { UserActions } from '../slices/user.slice';

export interface RoleState {
  roles: ApiRole[],
  isLoading: boolean
  lastUpdated: number
}

export const roleInitialState: RoleState = {
  roles: [],
  isLoading: false,
  lastUpdated: 0,
};

export function roleReducer(state = roleInitialState, action: any) {
  switch (action.type) {
    case UserActions.changeOrg.type:
      return roleInitialState;
    case Role.Actions.Fetch.type: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case Role.Actions.FetchSuccess.type: {
      const payload = (action as Role.Actions.FetchSuccess).payload;
      return {
        ...state,
        roles: payload.roles,
        isLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case Role.Actions.FetchFailure.type: {
      return {
        ...state,
        roles: [],
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
