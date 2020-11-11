import { Workspace } from '../actions/workspace.actions';
import { User } from '../actions/user.actions';
import { ApiWorkspace } from '../models/api-response';

export interface WorkspaceState {
  workspaces: ApiWorkspace[],
  isLoading: boolean
  lastUpdated: number
}

export const workspaceInitialState: WorkspaceState = {
  workspaces: [],
  isLoading: false,
  lastUpdated: 0,
};

export function workspaceReducer(state = workspaceInitialState, action: any) {
  switch (action.type) {
    case User.Actions.ChangeOrg.type:
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
    default:
      return state;
  }
}
