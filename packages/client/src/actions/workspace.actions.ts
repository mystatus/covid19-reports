import { Dispatch } from 'redux';
import {
  ApiDashboard,
  ApiWorkspace,
} from '../models/api-response';
import { WorkspaceClient } from '../client/workspace.client';

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

    export class FetchDashboards {
      static type = 'FETCH_DASHBOARDS';
      type = FetchDashboards.type;
      constructor(public payload: {
        workspaceId: number
      }) {}
    }
    export class FetchDashboardsSuccess {
      static type = `${FetchDashboards.type}_SUCCESS`;
      type = FetchDashboardsSuccess.type;
      constructor(public payload: {
        workspaceId: number
        dashboards: ApiDashboard[]
      }) {}
    }
    export class FetchDashboardsFailure {
      static type = `${FetchDashboards.type}_FAILURE`;
      type = FetchDashboardsFailure.type;
      constructor(public payload: {
        workspaceId: number
        error: any
      }) {}
    }

  }

  export const fetch = (orgId: number) => async (dispatch: Dispatch) => {
    dispatch({ ...new Actions.Fetch() });
    try {
      const workspaces = await WorkspaceClient.getOrgWorkspaces(orgId);
      dispatch({ ...new Actions.FetchSuccess({ workspaces }) });
    } catch (error) {
      dispatch({ ...new Actions.FetchFailure({ error }) });
    }
  };

  export const fetchDashboards = (orgId: number, workspaceId: number) => async (dispatch: Dispatch) => {
    dispatch({ ...new Actions.FetchDashboards({ workspaceId }) });
    try {
      const dashboards = await WorkspaceClient.getWorkspaceDashboards(orgId, workspaceId);
      dispatch({ ...new Actions.FetchDashboardsSuccess({ workspaceId, dashboards }) });
    } catch (error) {
      dispatch({ ...new Actions.FetchDashboardsFailure({ workspaceId, error }) });
    }
  };

}

