import { ApiMusterConfiguration } from '../models/api-response';
import { AppState } from '../store';

export namespace MusterSelector {
  export const all = (state: AppState): ApiMusterConfiguration[] => state.muster.configs;
}
