import {
  AddSavedLayoutBody,
  GetSavedLayoutsQuery,
  SavedLayoutSerialized,
  UpdateSavedLayoutBody,
} from '@covid19-reports/shared';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('saved-layout');

export class SavedLayoutClient {

  static getSavedLayouts(orgId: number, query: GetSavedLayoutsQuery): Promise<SavedLayoutSerialized[]> {
    return client.get(`${orgId}`, {
      params: query,
    });
  }

  static addSavedLayout(orgId: number, body: AddSavedLayoutBody): Promise<SavedLayoutSerialized> {
    return client.post(`${orgId}`, body);
  }

  static updateSavedLayout(orgId: number, savedLayoutId: number, body: UpdateSavedLayoutBody): Promise<SavedLayoutSerialized> {
    return client.put(`${orgId}/${savedLayoutId}`, body);
  }

  static deleteSavedLayout(orgId: number, savedLayoutId: number): Promise<SavedLayoutSerialized> {
    return client.delete(`${orgId}/${savedLayoutId}`);
  }

}
