import { ApiReportSchema } from '../models/api-response';
import { AppState } from '../store';

export namespace ReportSchemaSelector {
  export const all = (state: AppState): ApiReportSchema[] => state.reportSchema.reports;
}
