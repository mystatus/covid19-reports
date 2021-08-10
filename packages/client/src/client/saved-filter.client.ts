import {
  AddSavedFilterBody,
  GetSavedFiltersQuery,
  SavedFilterSerialized,
  UpdateSavedFilterBody,
} from '@covid19-reports/shared';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('saved-filter');

export class SavedFilterClient {

  static getSavedFilters(orgId: number, query: GetSavedFiltersQuery): Promise<SavedFilterSerialized[]> {
    return client.get(`${orgId}`, {
      params: query,
    });
  }

  static addSavedFilter(orgId: number, body: AddSavedFilterBody): Promise<SavedFilterSerialized> {
    return client.post(`${orgId}`, body);
  }

  static updateSavedFilter(orgId: number, savedFilterId: number, body: UpdateSavedFilterBody): Promise<SavedFilterSerialized> {
    return client.put(`${orgId}/${savedFilterId}`, body);
  }

  static deleteSavedFilter(orgId: number, savedFilterId: number): Promise<SavedFilterSerialized> {
    return client.delete(`${orgId}/${savedFilterId}`);
  }

}
