import {
  AddMusterConfigurationBody,
  GetMusterComplianceByDateRangeQuery,
  GetMusterComplianceByDateRangeResponse,
  GetMusterRosterQuery,
  GetMusterUnitTrendsQuery, UpdateMusterConfigurationBody,
} from '@covid19-reports/shared';
import {
  ApiMusterConfiguration,
  ApiMusterRosterEntriesPaginated,
  ApiMusterTrends,
} from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('muster');

export class MusterClient {

  static getMusterConfigs(orgId: number): Promise<ApiMusterConfiguration[]> {
    return client.get(`${orgId}`);
  }

  static addMusterConfig(orgId: number, body: AddMusterConfigurationBody): Promise<ApiMusterConfiguration> {
    return client.post(`${orgId}`, body);
  }

  static updateMusterConfig(orgId: number, musterId: number, body: UpdateMusterConfigurationBody): Promise<ApiMusterConfiguration> {
    return client.put(`${orgId}/${musterId}`, body);
  }

  static deleteMusterConfig(orgId: number, musterId: number): Promise<ApiMusterConfiguration> {
    return client.delete(`${orgId}/${musterId}`);
  }

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
