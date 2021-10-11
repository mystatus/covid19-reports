import { AppState } from '../store';

export namespace EntityActionRegistrySelector {
  export const all = (state: AppState) => state.entityActionRegistry.actions;
}
