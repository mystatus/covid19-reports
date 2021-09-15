import { Dispatch } from 'redux';
import { ApiMusterConfiguration } from '../models/api-response';
import { MusterClient } from '../client/muster.client';

export namespace Muster {

  export namespace Actions {

    export class Fetch {

      static type = 'FETCH_MUSTER_CONFIGS';
      type = Fetch.type;

    }
    export class FetchSuccess {

      static type = `${Fetch.type}_SUCCESS`;
      type = FetchSuccess.type;
      constructor(public payload: {
        configs: ApiMusterConfiguration[];
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
      const configs = await MusterClient.getMusterConfigs(orgId);
      dispatch({ ...new Actions.FetchSuccess({ configs }) });
    } catch (error) {
      dispatch({ ...new Actions.FetchFailure({ error }) });
    }
  };
}

