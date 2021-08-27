import {
  AddCustomColumnBody,
  AddRosterEntryBody,
  ColumnInfo,
  PaginationParams,
  SearchBody,
  UpdateCustomColumnBody,
  UpdateRosterEntryBody,
} from '@covid19-reports/shared';
import {
  ApiRosterEntry,
  ApiRosterPaginated,
  ApiRosterUploadInfo,
} from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('roster');

export class RosterClient {

  static getRosterColumnsInfo(orgId: number): Promise<ColumnInfo[]> {
    return client.get(`${orgId}/column`);
  }

  static getAllowedRosterColumnsInfo(orgId: number): Promise<ColumnInfo[]> {
    return client.get(`${orgId}/allowed-column`);
  }

  static addCustomColumn(orgId: number, body: AddCustomColumnBody): Promise<ColumnInfo> {
    return client.post(`${orgId}/column`, body);
  }

  static updateCustomColumn(orgId: number, columnName: string, body: UpdateCustomColumnBody): Promise<ColumnInfo> {
    return client.put(`${orgId}/column/${columnName}`, body);
  }

  static deleteCustomColumn(orgId: number, columnName: string): Promise<ColumnInfo> {
    return client.delete(`${orgId}/column/${columnName}`);
  }

  static getRosterTemplate(orgId: number): Promise<BlobPart> {
    return client.get(`${orgId}/template`, {
      responseType: 'blob',
    });
  }

  static getRoster(orgId: number, query: PaginationParams): Promise<ApiRosterPaginated> {
    return client.get(`${orgId}`, {
      params: query,
    });
  }

  static searchRoster(orgId: number, body: SearchBody, query: PaginationParams): Promise<ApiRosterPaginated> {
    return client.post(`${orgId}/search`, body, {
      params: query,
    });
  }

  static addRosterEntry(orgId: number, body: AddRosterEntryBody): Promise<ApiRosterEntry> {
    return client.post(`${orgId}`, body);
  }

  static updateRosterEntry(orgId: number, rosterEntryId: number, body: UpdateRosterEntryBody): Promise<ApiRosterEntry> {
    return client.put(`${orgId}/${rosterEntryId}`, body);
  }

  static deleteRosterEntry(orgId: number, rosterEntryId: number): Promise<ApiRosterEntry> {
    return client.delete(`${orgId}/${rosterEntryId}`);
  }

  static uploadRosterEntries(orgId: number, file: File): Promise<ApiRosterUploadInfo> {
    const formData = new FormData();
    formData.append('roster_csv', file);
    return client.post(`${orgId}/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static deleteRosterEntries(orgId: number): Promise<void> {
    return client.delete(`${orgId}/bulk`);
  }

}
