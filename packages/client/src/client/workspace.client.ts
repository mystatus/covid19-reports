import {
  AddWorkspaceBody,
  UpdateWorkspaceBody,
} from '@covid19-reports/shared';
import {
  ApiDashboard,
  ApiWorkspace,
  ApiWorkspaceTemplate,
} from '../models/api-response';
import { createApiClient } from '../utility/client-utils';

const client = createApiClient('workspace');

export class WorkspaceClient {

  static getOrgWorkspaces(orgId: number): Promise<ApiWorkspace[]> {
    return client.get(`${orgId}`);
  }

  static getOrgWorkspaceTemplates(orgId: number): Promise<ApiWorkspaceTemplate[]> {
    return client.get(`${orgId}/templates`);
  }

  static addWorkspace(orgId: number, body: AddWorkspaceBody): Promise<ApiWorkspace> {
    return client.post(`${orgId}`, body);
  }

  static deleteWorkspace(orgId: number, workspaceId: number): Promise<ApiWorkspace> {
    return client.delete(`${orgId}/${workspaceId}`);
  }

  static updateWorkspace(orgId: number, workspaceId: number, body: UpdateWorkspaceBody): Promise<ApiWorkspace> {
    return client.put(`${orgId}/${workspaceId}`, body);
  }

  static getWorkspaceDashboards(orgId: number, workspaceId: number): Promise<ApiDashboard[]> {
    return client.get(`${orgId}/${workspaceId}/dashboards`);
  }

}
