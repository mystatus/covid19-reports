import { AppState } from '../store';

export namespace WorkspaceSelector {
  export const all = (state: AppState) => state.workspace.workspaces;
  export const dashboards = (state: AppState) => state.workspace.dashboards ?? [];
}
