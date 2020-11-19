import { Dispatch } from 'redux';
import { WorkspaceClient } from '../client';
import { ApiWorkspace } from '../models/api-response';

export namespace Workspace {

  export namespace Actions {

    export class Fetch {
      static type = 'FETCH_WORKSPACES';
      type = Fetch.type;
    }
    export class FetchSuccess {
      static type = `${Fetch.type}_SUCCESS`;
      type = FetchSuccess.type;
      constructor(public payload: {
        workspaces: ApiWorkspace[]
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
      const workspaces = await WorkspaceClient.fetchAll(orgId);
      dispatch(new Actions.FetchSuccess({ workspaces }));
    } catch (error) {
      dispatch(new Actions.FetchFailure({ error }));
    }
  };
}

