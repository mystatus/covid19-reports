import { Unit } from '../actions/unit.actions';
import { ApiUnit } from '../models/api-response';
import { UserActions } from '../slices/user.slice';

export interface UnitState {
  units: ApiUnit[];
  isLoading: boolean;
  lastUpdated: number;
}

export const unitInitialState: UnitState = {
  units: [],
  isLoading: false,
  lastUpdated: 0,
};

export function unitReducer(state = unitInitialState, action: any) {
  switch (action.type) {
    case UserActions.changeOrg.type:
      return unitInitialState;
    case Unit.Actions.Fetch.type: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case Unit.Actions.FetchSuccess.type: {
      const payload = (action as Unit.Actions.FetchSuccess).payload;
      return {
        ...state,
        units: payload.units,
        isLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case Unit.Actions.FetchFailure.type: {
      return {
        ...state,
        units: [],
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
