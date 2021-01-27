import { User } from '../actions/user.actions';
import { getLoggedInState } from '../utility/user-utils';

// We need to be careful about what goes into local storage due to security concerns. So make sure not to add anything
// that is clearly identifying, such as PII/PHI data, group name, etc.

export interface LocalStorageState {
  orgId?: number
}

export const localStorageInitialState: LocalStorageState = {};

export function localStorageReducer(state = localStorageInitialState, action: any): LocalStorageState {
  switch (action.type) {
    case User.Actions.Register.type: {
      const { userData, localStorage } = (action as User.Actions.Register).payload;
      const loggedInState = getLoggedInState(userData, localStorage);
      return {
        ...state,
        orgId: loggedInState.activeRole?.role.org?.id,
      };
    }
    case User.Actions.Login.type: {
      const { userData, localStorage } = (action as User.Actions.Login).payload;
      const loggedInState = getLoggedInState(userData, localStorage);
      return {
        ...state,
        orgId: loggedInState.activeRole?.role.org?.id,
      };
    }
    case User.Actions.Logout.type: {
      return localStorageInitialState;
    }
    case User.Actions.ChangeOrg.type: {
      const { orgId } = (action as User.Actions.ChangeOrg).payload;
      return {
        ...state,
        orgId,
      };
    }
    default:
      return state;
  }
}
