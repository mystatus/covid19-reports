import { UpdateOrgDefaultMusterBody } from '@covid19-reports/shared';
import { ApiOrg } from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('org');

export class OrgClient {

  static getOrgList(): Promise<ApiOrg[]> {
    return client.get(`/`);
  }

  static updateOrgDefaultMuster(orgId: number, body: UpdateOrgDefaultMusterBody): Promise<ApiOrg> {
    return client.put(`${orgId}/default-muster`, body);
  }

}
