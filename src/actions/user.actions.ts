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
}

export interface UserRegisterData {
  firstName: string
  lastName: string
  phone: string
  service: string
  email: string
}
