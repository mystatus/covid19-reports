import { User } from '../actions/user.actions';
import { ApiRole, ApiUser } from '../models/api-response';
import { getLoggedInState } from '../utility/user-utils';

export interface UserState extends ApiUser {
  activeRole?: ApiRole
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
  let reduced = state;
  switch (action.type) {
    case User.Actions.Register.type: {
      const { userData, localStorage } = (action as User.Actions.Register).payload;
      const loggedInState = getLoggedInState(userData, localStorage);
      reduced = {
        ...state,
        ...loggedInState,
      };
      break;
    }
    case User.Actions.Login.type: {
      const { userData, localStorage } = (action as User.Actions.Login).payload;
      const loggedInState = getLoggedInState(userData, localStorage);
      reduced = {
        ...state,
        ...loggedInState,
      };
      break;
    }
    case User.Actions.Logout.type:
      reduced = userInitialState;
      break;
    case User.Actions.ChangeOrg.type: {
      const orgId = (action as User.Actions.ChangeOrg).payload.orgId;
      const userRole = state.userRoles?.find(ur => ur.role.org?.id === orgId);
      if (userRole) {
        const activeRole = userRole?.role;
        reduced = {
          ...state,
          activeRole,
        };
      }
      break;
    }
    default:
      break;
  }
  return reduced;
}
