import {
  GetMusterComplianceByDateQuery,
  GetMusterComplianceByDateRangeQuery,
  GetMusterComplianceByDateResponse,
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

  static getMusterRoster(orgId: number, query: GetMusterRosterQuery): Promise<ApiMusterRosterEntriesPaginated> {
    return client.get(`${orgId}/roster`, {
      params: query,
    });
  }

  static getMusterUnitTrends(orgId: number, query: GetMusterUnitTrendsQuery): Promise<ApiMusterTrends> {
    return client.get(`${orgId}/unit-trends`, {
      params: query,
    });
  }

  static getMusterComplianceByDate(orgId: number, unitName: string, query: GetMusterComplianceByDateQuery): Promise<GetMusterComplianceByDateResponse> {
    return client.get(`${orgId}/${unitName}/complianceByDate`, {
      params: query,
    });
  }

  static getMusterComplianceByDateRange(orgId: number, unitName: string, query: GetMusterComplianceByDateRangeQuery): Promise<GetMusterComplianceByDateRangeResponse> {
    return client.get(`${orgId}/${unitName}/complianceByDateRange`, {
      params: query,
    });
  }

}
