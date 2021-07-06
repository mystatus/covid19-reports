import { User } from '../actions/user.actions';
import { ApiReportSchema } from '../models/api-response';
import { ReportSchema } from '../actions/report-schema.actions';

export interface ReportSchemaState {
  reports: ApiReportSchema[],
  isLoading: boolean
  lastUpdated: number
}

export const reportSchemaInitialState: ReportSchemaState = {
  reports: [],
  isLoading: false,
  lastUpdated: 0,
};

export function reportSchemaReducer(state = reportSchemaInitialState, action: any) {
  switch (action.type) {
    case User.Actions.ChangeOrg.type:
      return reportSchemaInitialState;
    case ReportSchema.Actions.Fetch.type: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case ReportSchema.Actions.FetchSuccess.type: {
      const payload = (action as ReportSchema.Actions.FetchSuccess).payload;
      return {
        ...state,
        reports: payload.reports,
        isLoading: false,
        lastUpdated: Date.now(),
      };
    }
    case ReportSchema.Actions.FetchFailure.type: {
      return {
        ...state,
        reports: [],
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
