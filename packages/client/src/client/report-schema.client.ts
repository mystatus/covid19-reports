import { ApiReportSchema } from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('report');

export class ReportSchemaClient {

  static getOrgReports(orgId: number): Promise<ApiReportSchema[]> {
    return client.get(`${orgId}`);
  }

}
