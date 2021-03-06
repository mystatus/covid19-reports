import express, { Request } from 'express';
import { KibanaApi } from '../kibana/kibana-api';
import orgRoutes from './org/org.router';
import userRoutes from './user/user.router';
import roleRoutes from './role/role.router';
import rosterRoutes from './roster/roster.router';
import unitRoutes from './unit/unit.router';
import reingestRoutes from './reingest/reingest.router';
import accessRequestRoutes from './access-request/access-request.router';
import workspaceRoutes from './workspace/workspace.router';
import notificationRoutes from './notification/notification.router';
import musterRoutes from './muster/muster.router';
import reportRoutes from './report-schema/report-schema.router';
import exportRoutes from './export/export.router';
import orphanedRecordRoutes from './orphaned-record/orphaned-record.router';
import observationRoutes from './observation/observation.router';
import { User } from './user/user.model';
import { Org } from './org/org.model';
import { UserRole } from './user/user-role.model';
import { Workspace } from './workspace/workspace.model';

const router = express.Router();

router.use('/org', orgRoutes);
router.use('/user', userRoutes);
router.use('/role', roleRoutes);
router.use('/roster', rosterRoutes);
router.use('/unit', unitRoutes);
router.use('/access-request', accessRequestRoutes);
router.use('/workspace', workspaceRoutes);
router.use('/notification', notificationRoutes);
router.use('/muster', musterRoutes);
router.use('/report', reportRoutes);
router.use('/export', exportRoutes);
router.use('/reingest', reingestRoutes);
router.use('/orphaned-record', orphanedRecordRoutes);
router.use('/observation', observationRoutes);

export interface ApiRequest<ReqParams = object, ReqBody = object, ReqQuery = object, ResBody = object> extends Request<ReqParams, ResBody, ReqBody, ReqQuery> {
  appUser: User,
  appOrg?: Org,
  appUserRole?: UserRole,
  appWorkspace?: Workspace,
  kibanaApi?: KibanaApi,
}

export type OrgParam = {
  orgId: string
};

export type OrgPrefixParam = {
  orgPrefix: string
};

export type RoleParam = {
  roleId: string
};

export type ReportParam = {
  reportId: string
};

export type EdipiParam = {
  edipi: string
};

export type RosterParam = {
  rosterId: string
};

export type WorkspaceParam = {
  workspaceId: string
};

export type UnitParam = {
  unitId: string
};

export type SettingParam = {
  settingId: string
};

export type ColumnParam = {
  columnName: string
};

export type DashboardParam = {
  dashboardUuid: string
};

export type OrgRoleParams = OrgParam & RoleParam;
export type OrgReportParams = OrgParam & ReportParam;
export type OrgEdipiParams = OrgParam & EdipiParam;
export type OrgRosterParams = OrgParam & RosterParam;
export type OrgWorkspaceParams = OrgParam & WorkspaceParam;
export type OrgUnitParams = OrgParam & UnitParam;
export type OrgSettingParams = OrgParam & SettingParam;
export type OrgColumnParams = OrgParam & ColumnParam;

export type PaginatedQuery = {
  limit: string
  page: string
};

export type Paginated<TData> = {
  rows: TData[]
  totalRowsCount: number
};

export default router;
