import { ApiUnit } from '../models/api-response';
import { AppState } from '../store';

export namespace UnitSelector {
  export const all = (state: AppState): ApiUnit[] => state.unit.units;
}
