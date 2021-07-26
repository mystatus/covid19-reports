import { Workspace } from '../actions/workspace.actions';
import {
  ApiDashboard,
  ApiWorkspace,
} from '../models/api-response';
import { UserActions } from '../slices/user.slice';

export interface WorkspaceState {
  workspaces: ApiWorkspace[]
  dashboards: { [workspaceId: number]: ApiDashboard[] }
  dashboardsLoading: { [workspaceId: number]: boolean }
  dashboardsError: { [workspaceId: number]: any }
  isLoading: boolean
  lastUpdated: number
}

export const workspaceInitialState: WorkspaceState = {
  workspaces: [],
  dashboards: {},
  dashboardsLoading: {},
  dashboardsError: {},
  isLoading: false,
  lastUpdated: 0,
};

export function workspaceReducer(state = workspaceInitialState, action: any) {
  switch (action.type) {
    case UserActions.changeOrg.type:
      return workspaceInitialState;
    case Workspace.Actions.Fetch.type: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case Workspace.Actions.FetchSuccess.type: {
      const payload = (action as Workspace.Actions.FetchSuccess).payload;
      return {
        ...state,
        workspaces: payload.workspaces,
        isLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case Workspace.Actions.FetchFailure.type: {
      return {
        ...state,
        workspaces: [],
        isLoading: false,
      };
    }
    case Workspace.Actions.FetchDashboards.type: {
      const { workspaceId } = (action as Workspace.Actions.FetchDashboards).payload;
      return {
        ...state,
        dashboardsLoading: {
          ...state.dashboardsLoading,
          [workspaceId]: true,
        },
        dashboardsError: {
          ...state.dashboardsError,
          [workspaceId]: undefined,
        },
      };
    }
    case Workspace.Actions.FetchDashboardsSuccess.type: {
      const { workspaceId, dashboards } = (action as Workspace.Actions.FetchDashboardsSuccess).payload;
      return {
        ...state,
        dashboards: {
          ...state.dashboards,
          [workspaceId]: dashboards,
        },
        dashboardsLoading: {
          ...state.dashboardsLoading,
          [workspaceId]: false,
        },
      };
    }
    case Workspace.Actions.FetchDashboardsFailure.type: {
      const { workspaceId, error } = (action as Workspace.Actions.FetchDashboardsFailure).payload;
      return {
        ...state,
        dashboards: {
          ...state.dashboards,
          [workspaceId]: [],
        },
        dashboardsLoading: {
          ...state.dashboardsLoading,
          [workspaceId]: false,
        },
        dashboardsError: {
          ...state.dashboardsError,
          [workspaceId]: error,
        },
      };
    }
    default:
      return state;
  }
}
