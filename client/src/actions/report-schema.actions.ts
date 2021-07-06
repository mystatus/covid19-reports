import { Dispatch } from 'redux';
import { ReportSchemaClient } from '../client';
import { ApiReportSchema } from '../models/api-response';

export namespace ReportSchema {

  export namespace Actions {

    export class Fetch {
      static type = 'FETCH_REPORT_SCHEMAS';
      type = Fetch.type;
    }
    export class FetchSuccess {
      static type = `${Fetch.type}_SUCCESS`;
      type = FetchSuccess.type;
      constructor(public payload: {
        reports: ApiReportSchema[]
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
      const reports = await ReportSchemaClient.fetchAll(orgId);
      dispatch(new Actions.FetchSuccess({ reports }));
    } catch (error) {
      dispatch(new Actions.FetchFailure({ error }));
    }
  };
}

