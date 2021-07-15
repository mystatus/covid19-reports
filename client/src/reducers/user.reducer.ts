import _ from 'lodash';
import { User } from '../actions/user.actions';
import {
  ApiUser,
  ApiUserRole,
} from '../models/api-response';
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
    case User.Actions.AddFavoriteDashboard.type: {
      const { workspaceId, dashboardUuid } = (action as User.Actions.AddFavoriteDashboard).payload;
      return addFavoriteDashboard(state, workspaceId, dashboardUuid);
    }
    case User.Actions.AddFavoriteDashboardFailure.type: {
      // Undo add.
      const { workspaceId, dashboardUuid } = (action as User.Actions.AddFavoriteDashboardFailure).payload;
      return removeFavoriteDashboard(state, workspaceId, dashboardUuid);
    }
    case User.Actions.RemoveFavoriteDashboard.type: {
      const { workspaceId, dashboardUuid } = (action as User.Actions.RemoveFavoriteDashboard).payload;
      return removeFavoriteDashboard(state, workspaceId, dashboardUuid);
    }
    case User.Actions.RemoveFavoriteDashboardFailure.type: {
      // Undo remove.
      const { workspaceId, dashboardUuid } = (action as User.Actions.RemoveFavoriteDashboard).payload;
      return addFavoriteDashboard(state, workspaceId, dashboardUuid);
    }
    default:
      return state;
  }
}

function addFavoriteDashboard(state: UserState, workspaceId: number, dashboardUuid: string) {
  const favoriteDashboards = _.cloneDeep(state.activeRole!.favoriteDashboards);
  if (!favoriteDashboards[workspaceId]) {
    favoriteDashboards[workspaceId] = {};
  }
  favoriteDashboards[workspaceId][dashboardUuid] = true;
  return {
    ...state,
    activeRole: {
      ...state.activeRole!,
      favoriteDashboards,
    },
  };
}

function removeFavoriteDashboard(state: UserState, workspaceId: number, dashboardUuid: string) {
  const favoriteDashboards = _.cloneDeep(state.activeRole!.favoriteDashboards);
  if (favoriteDashboards[workspaceId]) {
    delete favoriteDashboards[workspaceId][dashboardUuid];
  }
  return {
    ...state,
    activeRole: {
      ...state.activeRole!,
      favoriteDashboards,
    },
  };
}
