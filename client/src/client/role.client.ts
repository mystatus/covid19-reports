import {
  AddRoleBody,
  UpdateRoleBody,
} from '@covid19-reports/shared';
import { ApiRole } from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('role');

export class RoleClient {

  static getOrgRoles(orgId: number): Promise<ApiRole[]> {
    return client.get(`${orgId}`);
  }

  static addRole(orgId: number, body: AddRoleBody): Promise<ApiRole> {
    return client.post(`${orgId}`, body);
  }

  static deleteRole(orgId: number, roleId: number): Promise<ApiRole> {
    return client.delete(`${orgId}/${roleId}`);
  }

  static updateRole(orgId: number, roleId: number, body: UpdateRoleBody): Promise<ApiRole> {
    return client.put(`${orgId}/${roleId}`, body);
  }

}
