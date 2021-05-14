import { AppState } from '../store';

export namespace PersistSelector {
  export const get = <T>(persistKey?: string) => (state: AppState): T | undefined => (persistKey ? state.localStorage[persistKey] as T : undefined);
}
