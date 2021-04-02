import { Dispatch } from 'redux';
import { AppState } from '../store';
import { ApiUser } from '../models/api-response';
import { UserClient } from '../client';
import { LocalStorageState } from '../reducers/local-storage.reducer';

export namespace User {

  export namespace Actions {

    export class Refresh {
      static type = 'USER_REFRESH';
      type = Refresh.type;
      constructor(public payload: {
        userData: ApiUser
        localStorage: LocalStorageState
      }) {}
    }

    export class Logout {
      static type = 'USER_LOGOUT';
      type = Logout.type;
    }

    export class ChangeOrg {
      static type = 'USER_CHANGE_ORG';
      type = ChangeOrg.type;
      constructor(public payload: {
        orgId: number
      }) {}
    }

    export class Register {
      static type = 'USER_REGISTER';
      type = Register.type;
      constructor(public payload: {
        userData: ApiUser
        localStorage: LocalStorageState
      }) {}
    }

    export class AddFavoriteDashboard {
      static type = 'ADD_FAVORITE_DASHBOARD';
      type = AddFavoriteDashboard.type;
      constructor(public payload: {
        workspaceId: number
        dashboardUuid: string
      }) {}
    }
    export class AddFavoriteDashboardSuccess {
      static type = `${AddFavoriteDashboard.type}_SUCCESS`;
      type = AddFavoriteDashboardSuccess.type;
      constructor(public payload: {
        workspaceId: number
        dashboardUuid: string
      }) {}
    }
    export class AddFavoriteDashboardFailure {
      static type = `${AddFavoriteDashboard.type}_FAILURE`;
      type = AddFavoriteDashboardFailure.type;
      constructor(public payload: {
        workspaceId: number
        dashboardUuid: string
        error: any
      }) {}
    }

    export class RemoveFavoriteDashboard {
      static type = 'REMOVE_FAVORITE_DASHBOARD';
      type = RemoveFavoriteDashboard.type;
      constructor(public payload: {
        workspaceId: number
        dashboardUuid: string
      }) {}
    }
    export class RemoveFavoriteDashboardSuccess {
      static type = `${RemoveFavoriteDashboard.type}_SUCCESS`;
      type = RemoveFavoriteDashboardSuccess.type;
      constructor(public payload: {
        workspaceId: number
        dashboardUuid: string
      }) {}
    }
    export class RemoveFavoriteDashboardFailure {
      static type = `${RemoveFavoriteDashboard.type}_FAILURE`;
      type = RemoveFavoriteDashboardFailure.type;
      constructor(public payload: {
        workspaceId: number
        dashboardUuid: string
        error: any
      }) {}
    }

  }

  export const refresh = () => async (dispatch: Dispatch<Actions.Refresh>, getState: () => AppState) => {
    const userData = await UserClient.current();

    console.log('userData', userData);

    const { localStorage } = getState();

    dispatch(new Actions.Refresh({
      userData,
      localStorage,
    }));
  };

  export const logout = () => (dispatch: Dispatch<Actions.Logout>) => {
    dispatch(new Actions.Logout());
  };

  export const changeOrg = (orgId: number) => (dispatch: Dispatch<Actions.ChangeOrg>) => {
    dispatch(new Actions.ChangeOrg({ orgId }));
  };

  export const register = (data: UserRegisterData) => async (dispatch: Dispatch<Actions.Register>, getState: () => AppState) => {
    console.log('register', data);

    const userData = await UserClient.register({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      service: data.service,
    });

    const { localStorage } = getState();

    dispatch(new Actions.Register({
      userData,
      localStorage,
    }));
  };

  export const addFavoriteDashboard = (orgId: number, workspaceId: number, dashboardUuid: string) => async (dispatch: Dispatch) => {
    dispatch(new Actions.AddFavoriteDashboard({ workspaceId, dashboardUuid }));
    try {
      await UserClient.addFavoriteDashboard(orgId, workspaceId, dashboardUuid);
      dispatch(new Actions.AddFavoriteDashboardSuccess({ workspaceId, dashboardUuid }));
    } catch (error) {
      dispatch(new Actions.AddFavoriteDashboardFailure({ workspaceId, dashboardUuid, error }));
    }
  };

  export const removeFavoriteDashboard = (orgId: number, workspaceId: number, dashboardUuid: string) => async (dispatch: Dispatch) => {
    dispatch(new Actions.RemoveFavoriteDashboard({ workspaceId, dashboardUuid }));
    try {
      await UserClient.removeFavoriteDashboard(orgId, workspaceId, dashboardUuid);
      dispatch(new Actions.RemoveFavoriteDashboardSuccess({ workspaceId, dashboardUuid }));
    } catch (error) {
      dispatch(new Actions.RemoveFavoriteDashboardFailure({ workspaceId, dashboardUuid, error }));
    }
  };
}

export interface UserRegisterData {
  firstName: string
  lastName: string
  phone: string
  service: string
  email: string
}
