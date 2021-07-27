import {
  AddOrphanedRecordActionBody,
  GetOrphanedRecordsQuery,
  ResolveOrphanedRecordWithAddBody,
  ResolveOrphanedRecordWithEditBody,
} from '@covid19-reports/shared';
import {
  ApiOrphanedRecord,
  ApiOrphanedRecordAction,
  ApiOrphanedRecordsCount,
  ApiOrphanedRecordsPaginated,
} from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('orphaned-record');

export class OrphanedRecordClient {

  static getOrphanedRecordsCount(orgId: number): Promise<ApiOrphanedRecordsCount> {
    return client.get(`${orgId}/count`);
  }

  static getOrphanedRecords(orgId: number, query: GetOrphanedRecordsQuery): Promise<ApiOrphanedRecordsPaginated> {
    return client.get(`${orgId}`, {
      params: query,
    });
  }

  static resolveOrphanedRecordWithAdd(orgId: number, rowId: string, body: ResolveOrphanedRecordWithAddBody): Promise<ApiOrphanedRecord> {
    return client.put(`${orgId}/${rowId}/resolve-with-add`, body);
  }

  static resolveOrphanedRecordWithEdit(orgId: number, rowId: string, body: ResolveOrphanedRecordWithEditBody): Promise<ApiOrphanedRecord> {
    return client.put(`${orgId}/${rowId}/resolve-with-edit`, body);
  }

  static addOrphanedRecordAction(orgId: number, rowId: string, body: AddOrphanedRecordActionBody): Promise<ApiOrphanedRecordAction> {
    return client.put(`${orgId}/${rowId}/action`, body);
  }

}
