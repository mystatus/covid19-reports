import { Dispatch } from 'redux';
import axios, { AxiosResponse } from 'axios';

interface UserData {
  edipi: string,
  first_name: string,
  last_name: string,
  phone: string,
  email: string,
  enabled: boolean,
  root_admin: boolean,
  is_registered: boolean,
  roles: [{
    id: number,
    name: string,
    description: string,
    index_prefix: string,
    can_manage_users: boolean,
    can_manage_roster: boolean,
    can_manage_roles: boolean,
    can_view_roster: boolean,
    can_manage_dashboards: boolean,
    org: {
      id: number,
      name: string,
      description: string,
      index_prefix: string
    }
  }]
}

export namespace User {

  export namespace Actions {

    export class Login {
      static type = 'USER_LOGIN';
      type = Login.type;
      constructor(public payload: {
        userData: UserData
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
  }

  export const login = () => async (dispatch: Dispatch<Actions.Login>) => {
    const response = await axios.get('api/user/current') as AxiosResponse<UserData>;
    const userData = response.data;

    console.log('userData', userData);

    dispatch({
      ...new Actions.Login({ userData }),
    });
  };

  export const logout = () => (dispatch: Dispatch<Actions.Logout>) => {
    dispatch({
      ...new Actions.Logout(),
    });
  };

  export const changeOrg = (orgId: number) => (dispatch: Dispatch<Actions.ChangeOrg>) => {
    dispatch({
      ...new Actions.ChangeOrg({ orgId }),
    });
  };
}
