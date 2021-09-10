import { ApiOrg } from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('org');

export class OrgClient {

  static getOrgList(): Promise<ApiOrg[]> {
    return client.get(`/`);
  }

}
