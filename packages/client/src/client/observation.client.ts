import {
  ColumnInfo,
  PaginationParams,
  SearchBody,
} from '@covid19-reports/shared';
import { ApiObservationsPaginated } from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('observation');

export class ObservationClient {

  static getColumnsInfo(orgId: number): Promise<ColumnInfo[]> {
    return client.get(`${orgId}/column`);
  }

  static getAllowedColumnsInfo(orgId: number): Promise<ColumnInfo[]> {
    return client.get(`${orgId}/allowed-column`);
  }

  static getObservations(orgId: number, query: PaginationParams, body?: SearchBody) {
    return client.abortable().request<ApiObservationsPaginated>({
      url: `${orgId}`,
      method: (body && Object.keys(body).length) ? 'post' : 'get',
      data: body,
      params: query,
    });
  }

}
