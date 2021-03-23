import { User } from '../actions/user.actions';
import { ApiUser, ApiUserRole } from '../models/api-response';
import { getLoggedInState } from '../utility/user-utils';

export interface UserState extends ApiUser {
  activeRole?: ApiUserRole
  isLoggedIn: boolean
}

export const userInitialState: UserState = {
  edipi: '',
  firstName: '',
  lastName: '',
  phone: '',
  service: '',
  email: '',
  rootAdmin: false,
  isRegistered: false,
  userRoles: [],
  isLoggedIn: false,
};

export function userReducer(state = userInitialState, action: any): UserState {
  switch (action.type) {
    case User.Actions.Register.type: {
      const { userData, localStorage } = (action as User.Actions.Register).payload;
      const loggedInState = getLoggedInState(userData, localStorage);
      return {
        ...state,
        ...loggedInState,
      };
    }
    case User.Actions.Refresh.type: {
      const { userData, localStorage } = (action as User.Actions.Refresh).payload;
      const loggedInState = getLoggedInState(userData, localStorage);
      return {
        ...state,
        ...loggedInState,
      };
    }
    case User.Actions.Logout.type:
      return userInitialState;
    case User.Actions.ChangeOrg.type: {
      const orgId = (action as User.Actions.ChangeOrg).payload.orgId;
      const userRole = state.userRoles?.find(ur => ur.role.org?.id === orgId);
      return {
        ...state,
        activeRole: userRole,
      };
    }
    default:
      return state;
  }
}
