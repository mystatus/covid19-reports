import {
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

}
