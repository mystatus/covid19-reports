import { Dispatch } from 'redux';
import { RoleClient } from '../client';
import { ApiRole } from '../models/api-response';

export namespace Role {

  export namespace Actions {

    export class Fetch {
      static type = 'FETCH_ROLES';
      type = Fetch.type;
    }
    export class FetchSuccess {
      static type = `${Fetch.type}_SUCCESS`;
      type = FetchSuccess.type;
      constructor(public payload: {
        roles: ApiRole[]
      }) {}
    }
    export class FetchFailure {
      static type = `${Fetch.type}_FAILURE`;
      type = FetchFailure.type;
      constructor(public payload: {
        error: any
      }) { }
    }
  }

  export const fetch = (orgId: number) => async (dispatch: Dispatch) => {
    dispatch(new Actions.Fetch());
    try {
      const roles = await RoleClient.fetchAll(orgId);
      dispatch(new Actions.FetchSuccess({ roles }));
    } catch (error) {
      dispatch(new Actions.FetchFailure({ error }));
    }
  };
}

