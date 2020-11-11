import { ApiWorkspace } from '../models/api-response';
import { AppState } from '../store';

export namespace WorkspaceSelector {
  export const all = (state: AppState): ApiWorkspace[] => state.workspace.workspaces;
}
