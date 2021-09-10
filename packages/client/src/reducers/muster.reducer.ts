import { ApiMusterConfiguration } from '../models/api-response';
import { UserActions } from '../slices/user.slice';
import { Muster } from '../actions/muster.actions';

export interface MusterState {
  configs: ApiMusterConfiguration[];
  isLoading: boolean;
  lastUpdated: number;
}

export const musterInitialState: MusterState = {
  configs: [],
  isLoading: false,
  lastUpdated: 0,
};

export function musterReducer(state = musterInitialState, action: any) {
  switch (action.type) {
    case UserActions.changeOrg.type:
      return musterInitialState;
    case Muster.Actions.Fetch.type: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case Muster.Actions.FetchSuccess.type: {
      const payload = (action as Muster.Actions.FetchSuccess).payload;
      return {
        ...state,
        configs: payload.configs,
        isLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case Muster.Actions.FetchFailure.type: {
      return {
        ...state,
        configs: [],
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
