import { HelpCard } from '../actions/help-card.actions';
import { User } from '../actions/user.actions';
import { Dict } from '../utility/typescript-utils';
import { getLoggedInState } from '../utility/user-utils';

// We need to be careful about what goes into local storage due to security concerns. So make sure not to add anything
// that is clearly identifying of groups, units, or individuals, such as PII/PHI data, group name, etc.

export interface LocalStorageState {
  orgId?: number
  hideHelpCard?: Dict<boolean>
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
    case User.Actions.Refresh.type: {
      const { userData, localStorage } = (action as User.Actions.Refresh).payload;
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
    case HelpCard.Actions.Hide.type: {
      const { helpCardId } = (action as HelpCard.Actions.Hide).payload;
      return {
        ...state,
        hideHelpCard: {
          ...state.hideHelpCard,
          [helpCardId]: true,
        },
      };
    }
    default:
      return state;
  }
}
