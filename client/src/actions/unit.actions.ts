import { Dispatch } from 'redux';
import { UnitClient } from '../client/api';
import { ApiUnit } from '../models/api-response';

export namespace Unit {

  export namespace Actions {

    export class Fetch {
      static type = 'FETCH_UNITS';
      type = Fetch.type;
    }
    export class FetchSuccess {
      static type = `${Fetch.type}_SUCCESS`;
      type = FetchSuccess.type;
      constructor(public payload: {
        units: ApiUnit[]
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
      const units = await UnitClient.fetchAll(orgId);
      dispatch(new Actions.FetchSuccess({ units }));
    } catch (error) {
      dispatch(new Actions.FetchFailure({ error }));
    }
  };
}

