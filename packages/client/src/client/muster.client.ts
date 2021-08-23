import {
  GetMusterComplianceByDateRangeQuery,
  GetMusterComplianceByDateRangeResponse,
  GetMusterRosterQuery,
  GetMusterUnitTrendsQuery,
} from '@covid19-reports/shared';
import {
  ApiMusterRosterEntriesPaginated,
  ApiMusterTrends,
} from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('muster');

export class MusterClient {

  static getRosterMusterComplianceByDateRange(orgId: number, query: GetMusterRosterQuery): Promise<ApiMusterRosterEntriesPaginated> {
    return client.get(`${orgId}/roster/complianceByDateRange`, {
      params: query,
    });
  }

  static getMusterUnitTrends(orgId: number, query: GetMusterUnitTrendsQuery): Promise<ApiMusterTrends> {
    return client.get(`${orgId}/unit-trends`, {
      params: query,
    });
  }

  static getUnitMusterComplianceByDateRange(orgId: number, unitName: string, query: GetMusterComplianceByDateRangeQuery): Promise<GetMusterComplianceByDateRangeResponse> {
    return client.get(`${orgId}/${unitName}/complianceByDateRange`, {
      params: query,
    });
  }

}
