import { Dispatch } from 'redux';
import { ApiUnit } from '../models/api-response';
import { UnitClient } from '../client/unit.client';

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
        units: ApiUnit[];
      }) {}

    }
    export class FetchFailure {

      static type = `${Fetch.type}_FAILURE`;
      type = FetchFailure.type;
      constructor(public payload: {
        error: any;
      }) { }

    }
  }

  export const fetch = (orgId: number) => async (dispatch: Dispatch) => {
    dispatch({ ...new Actions.Fetch() });
    try {
      const units = await UnitClient.getUnits(orgId);
      dispatch({ ...new Actions.FetchSuccess({ units }) });
    } catch (error) {
      dispatch({ ...new Actions.FetchFailure({ error }) });
    }
  };
}

