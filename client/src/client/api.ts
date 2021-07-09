import axios, {
  AxiosError,
  AxiosResponse,
} from 'axios';
import axiosRetry from 'axios-retry';
import {
  GetMusterRosterQuery,
  GetMusterUnitTrendsQuery,
} from 'covid19-reports-server/src/api/muster/muster.controller';
import {
  AddRoleBody,
  UpdateRoleBody,
} from 'covid19-reports-server/src/api/role/role.controller';
import {
  AddWorkspaceBody,
  UpdateWorkspaceBody,
} from 'covid19-reports-server/src/api/workspace/workspace.controller';
import { ExportMusterIndividualsQuery } from 'covid19-reports-server/src/api/export/export.controller';
import {
  AddCustomColumnBody,
  AddRosterEntryBody,
  GetRosterQuery,
  SearchRosterBody,
  SearchRosterQuery,
  UpdateCustomColumnBody,
  UpdateRosterEntryBody,
} from 'covid19-reports-server/src/api/roster/roster.controller';
import {
  AddOrphanedRecordActionBody,
  ResolveOrphanedRecordWithAddBody,
  ResolveOrphanedRecordWithEditBody,
} from 'covid19-reports-server/src/api/orphaned-record/orphaned-record.controller';
import {
  AddUserNotificationSettingBody,
  UpdateUserNotificationSettingBody,
} from 'covid19-reports-server/src/api/notification/notification.controller';
import { UpdateOrgDefaultMusterBody } from 'covid19-reports-server/src/api/org/org.controller';
import {
  AddUnitBody,
  UpdateUnitBody,
} from 'covid19-reports-server/src/api/unit/unit.controller';
import {
  ApproveAccessRequestBody,
  DenyAccessRequestBody,
  IssueAccessRequestBody,
} from 'covid19-reports-server/src/api/access-request/access-request.controller';
import { UserRegisterData } from '../actions/user.actions';
import {
  ApiAccessRequest,
  ApiDashboard,
  ApiMusterRosterEntriesPaginated,
  ApiMusterTrends,
  ApiNotification,
  ApiOrg,
  ApiOrphanedRecord,
  ApiOrphanedRecordAction,
  ApiOrphanedRecordsCount,
  ApiOrphanedRecordsPaginated,
  ApiReportSchema,
  ApiRole,
  ApiRosterColumnInfo,
  ApiRosterEntry,
  ApiRosterPaginated,
  ApiRosterUploadInfo,
  ApiUnit,
  ApiUser,
  ApiUserNotificationSetting,
  ApiWorkspace,
  ApiWorkspaceTemplate,
} from '../models/api-response';

const client = axios.create({
  baseURL: `${window.location.origin}/api/`,
  headers: {
    Accept: 'application/json',
  },
});

client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw error.response;
    } else if (error.request) {
      throw error.request;
    } else {
      throw new Error(error.message);
    }
  },
);

axiosRetry(client, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

export class AccessRequestClient {

  static getAccessRequests(orgId: number): Promise<ApiAccessRequest[]> {
    return client.get(`access-request/${orgId}`);
  }

  static issueAccessRequest(orgId: number, body: IssueAccessRequestBody): Promise<ApiAccessRequest> {
    return client.post(`access-request/${orgId}`, body);
  }

  static approveAccessRequest(orgId: number, body: ApproveAccessRequestBody): Promise<void> {
    return client.post(`access-request/${orgId}/approve`, body);
  }

  static denyAccessRequest(orgId: number, body: DenyAccessRequestBody): Promise<void> {
    return client.post(`access-request/${orgId}/deny`, body);
  }

  static cancelAccessRequest(orgId: number): Promise<void> {
    return client.post(`access-request/${orgId}/cancel`);
  }

}

export class ExportClient {

  static exportRosterToCsv(orgId: number): Promise<BlobPart> {
    return client.get(`export/${orgId}/roster`, {
      responseType: 'blob',
    });
  }

  static exportMusterRosterToCsv(orgId: number, query: ExportMusterIndividualsQuery): Promise<BlobPart> {
    return client.get(`export/${orgId}/muster/roster`, {
      params: query,
      responseType: 'blob',
    });
  }

}

export class MusterClient {

  static getMusterRoster(orgId: number, query: GetMusterRosterQuery): Promise<ApiMusterRosterEntriesPaginated> {
    return client.get(`muster/${orgId}/roster`, {
      params: query,
    });
  }

  static getMusterUnitTrends(orgId: number, query: GetMusterUnitTrendsQuery): Promise<ApiMusterTrends> {
    return client.get(`muster/${orgId}/unit-trends`, {
      params: query,
    });
  }

}

export class NotificationClient {

  static getAvailableNotifications(orgId: number): Promise<ApiNotification[]> {
    return client.get(`notification/${orgId}`);
  }

  static getAllNotifications(orgId: number): Promise<ApiNotification[]> {
    return client.get(`notification/${orgId}/all`);
  }

  static getUserNotificationSettings(orgId: number): Promise<ApiUserNotificationSetting[]> {
    return client.get(`notification/${orgId}/setting`);
  }

  static addUserNotificationSetting(orgId: number, body: AddUserNotificationSettingBody): Promise<ApiUserNotificationSetting> {
    return client.post(`notification/${orgId}/setting`, body);
  }

  static deleteUserNotificationSetting(orgId: number, settingId: number): Promise<ApiUserNotificationSetting> {
    return client.delete(`notification/${orgId}/setting/${settingId}`);
  }

  static updateUserNotificationSetting(orgId: number, settingId: number, body: UpdateUserNotificationSettingBody): Promise<ApiUserNotificationSetting> {
    return client.put(`notification/${orgId}/setting/${settingId}`, body);
  }

}

export class OrgClient {

  static getOrgList(): Promise<ApiOrg[]> {
    return client.get('org');
  }

  static updateOrgDefaultMuster(orgId: number, body: UpdateOrgDefaultMusterBody): Promise<ApiOrg> {
    return client.put(`org/${orgId}/default-muster`, body);
  }

}

export class OrphanedRecordClient {

  static getOrphanedRecordsCount(orgId: number): Promise<ApiOrphanedRecordsCount> {
    return client.get(`orphaned-record/${orgId}/count`);
  }

  static getOrphanedRecords(orgId: number, page: number, limit: number, unit?: string): Promise<ApiOrphanedRecordsPaginated> {
    return client.get(`orphaned-record/${orgId}`, {
      params: {
        page,
        limit,
        unit,
      },
    });
  }

  static resolveOrphanedRecordWithAdd(orgId: number, rowId: string, body: ResolveOrphanedRecordWithAddBody): Promise<ApiOrphanedRecord> {
    return client.put(`orphaned-record/${orgId}/${rowId}/resolve-with-add`, body);
  }

  static resolveOrphanedRecordWithEdit(orgId: number, rowId: string, body: ResolveOrphanedRecordWithEditBody): Promise<ApiOrphanedRecord> {
    return client.put(`orphaned-record/${orgId}/${rowId}/resolve-with-edit`, body);
  }

  static addOrphanedRecordAction(orgId: number, rowId: string, body: AddOrphanedRecordActionBody): Promise<ApiOrphanedRecordAction> {
    return client.put(`orphaned-record/${orgId}/${rowId}/action`, body);
  }

}

export class ReportSchemaClient {
  static fetchAll(orgId: number): Promise<ApiReportSchema[]> {
    return client.get(`report/${orgId}`);
  }
}

export class RoleClient {
  static fetchAll(orgId: number): Promise<ApiRole[]> {
    return client.get(`role/${orgId}`);
  }

  static updateRole(orgId: number, roleId: number, body: UpdateRoleBody): Promise<ApiRole> {
    return client.put(`role/${orgId}/${roleId}`, body);
  }

  static addRole(orgId: number, body: AddRoleBody): Promise<ApiRole> {
    return client.post(`role/${orgId}`, body);
  }

  static deleteRole(orgId: number, roleId: number): Promise<ApiRole> {
    return client.delete(`role/${orgId}/${roleId}`);
  }
}

export class RosterClient {

  static getRosterColumnsInfo(orgId: number): Promise<ApiRosterColumnInfo[]> {
    return client.get(`roster/${orgId}/column`);
  }

  static getAllowedRosterColumnsInfo(orgId: number): Promise<ApiRosterColumnInfo[]> {
    return client.get(`roster/${orgId}/allowed-column`);
  }

  static addCustomColumn(orgId: number, body: AddCustomColumnBody): Promise<ApiRosterColumnInfo> {
    return client.post(`roster/${orgId}/column`, body);
  }

  static updateCustomColumn(orgId: number, columnName: string, body: UpdateCustomColumnBody): Promise<ApiRosterColumnInfo> {
    return client.put(`roster/${orgId}/column/${columnName}`, body);
  }

  static deleteCustomColumn(orgId: number, columnName: string): Promise<ApiRosterColumnInfo> {
    return client.delete(`roster/${orgId}/column/${columnName}`);
  }

  static getRosterTemplate(orgId: number): Promise<BlobPart> {
    return client.get(`roster/${orgId}/template`, {
      responseType: 'blob',
    });
  }

  static getRoster(orgId: number, query: GetRosterQuery): Promise<ApiRosterPaginated> {
    return client.get(`api/roster/${orgId}`, {
      params: query,
    });
  }

  static searchRoster(orgId: number, body: SearchRosterBody, query: SearchRosterQuery): Promise<ApiRosterPaginated> {
    return client.post(`roster/${orgId}/search`, body, {
      params: query,
    });
  }

  static addRosterEntry(orgId: number, body: AddRosterEntryBody): Promise<ApiRosterEntry> {
    return client.post(`roster/${orgId}`, body);
  }

  static updateRosterEntry(orgId: number, rosterEntryId: number, body: UpdateRosterEntryBody): Promise<ApiRosterEntry> {
    return client.put(`roster/${orgId}/${rosterEntryId}`, body);
  }

  static deleteRosterEntry(orgId: number, rosterEntryId: number): Promise<ApiRosterEntry> {
    return client.delete(`roster/${orgId}/${rosterEntryId}`);
  }

  static uploadRosterEntries(orgId: number, file: File): Promise<ApiRosterUploadInfo> {
    const formData = new FormData();
    formData.append('roster_csv', file);
    return client.post(`roster/${orgId}/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static deleteRosterEntries(orgId: number): Promise<void> {
    return client.delete(`roster/${orgId}/bulk`);
  }

}

export class UnitClient {

  static getUnits(orgId: number): Promise<ApiUnit[]> {
    return client.get(`unit/${orgId}`);
  }

  static addUnit(orgId: number, body: AddUnitBody): Promise<ApiUnit> {
    return client.post(`unit/${orgId}`, body);
  }

  static updateUnit(orgId: number, unitId: number, body: UpdateUnitBody): Promise<ApiUnit> {
    return client.put(`unit/${orgId}/${unitId}`, body);
  }

  static deleteUnit(orgId: number, unitId: number): Promise<ApiUnit> {
    return client.delete(`unit/${orgId}/${unitId}`);
  }

}

export class UserClient {

  static current(): Promise<ApiUser> {
    return client.get(`user/current`);
  }

  static registerUser(data: UserRegisterData): Promise<ApiUser> {
    return client.post(`user`, data);
  }

  static getAccessRequests(): Promise<ApiAccessRequest[]> {
    return client.get('user/access-requests');
  }

  static getOrgUsers(orgId: number): Promise<ApiUser[]> {
    return client.get(`user/${orgId}`);
  }

  static addFavoriteDashboard(orgId: number, workspaceId: number, dashboardUuid: string): Promise<void> {
    return client.post(`user/${orgId}/favorite-dashboards/${workspaceId}/${dashboardUuid}`);
  }

  static removeFavoriteDashboard(orgId: number, workspaceId: number, dashboardUuid: string): Promise<void> {
    return client.delete(`user/${orgId}/favorite-dashboards/${workspaceId}/${dashboardUuid}`);
  }

}

export class WorkspaceClient {

  static getOrgWorkspaces(orgId: number): Promise<ApiWorkspace[]> {
    return client.get(`workspace/${orgId}`);
  }

  static getOrgWorkspaceTemplates(orgId: number): Promise<ApiWorkspaceTemplate[]> {
    return client.get(`workspace/${orgId}/templates`);
  }

  static addWorkspace(orgId: number, body: AddWorkspaceBody): Promise<ApiWorkspace> {
    return client.post(`workspace/${orgId}`, body);
  }

  static deleteWorkspace(orgId: number, workspaceId: number): Promise<ApiWorkspace> {
    return client.delete(`workspace/${orgId}/${workspaceId}`);
  }

  static updateWorkspace(orgId: number, workspaceId: number, body: UpdateWorkspaceBody): Promise<ApiWorkspace> {
    return client.put(`workspace/${orgId}/${workspaceId}`, body);
  }

  static getWorkspaceDashboards(orgId: number, workspaceId: number): Promise<ApiDashboard[]> {
    return client.get(`workspace/${orgId}/${workspaceId}/dashboards`);
  }

}

export default client;
