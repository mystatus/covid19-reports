import {
  RegisterUserBody,
  UpsertUserBody,
} from '@covid19-reports/shared';
import {
  ApiAccessRequest,
  ApiUser,
} from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('user');

export class UserClient {

  static current(): Promise<ApiUser> {
    return client.get(`current`);
  }

  static registerUser(body: RegisterUserBody): Promise<ApiUser> {
    return client.post(`/`, body);
  }

  static getAccessRequests(): Promise<ApiAccessRequest[]> {
    return client.get('access-requests');
  }

  static upsertUser(orgId: number, body: UpsertUserBody): Promise<ApiUser> {
    return client.post(`${orgId}`, body);
  }

  static getOrgUsers(orgId: number): Promise<ApiUser[]> {
    return client.get(`${orgId}`);
  }

  static removeUserFromOrg(orgId: number, edipi: string): Promise<ApiUser> {
    return client.delete(`${orgId}/${edipi}`);
  }

  static addFavoriteDashboard(orgId: number, workspaceId: number, dashboardUuid: string): Promise<void> {
    return client.post(`${orgId}/favorite-dashboards/${workspaceId}/${dashboardUuid}`);
  }

  static removeFavoriteDashboard(orgId: number, workspaceId: number, dashboardUuid: string): Promise<void> {
    return client.delete(`${orgId}/favorite-dashboards/${workspaceId}/${dashboardUuid}`);
  }

}
