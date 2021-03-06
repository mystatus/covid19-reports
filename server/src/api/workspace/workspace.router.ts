import bodyParser from 'body-parser';
import express from 'express';
import { KibanaApi } from '../../kibana/kibana-api';
import controller from './workspace.controller';
import {
  requireOrgAccess,
  requireRolePermission,
  requireWorkspaceAccess,
} from '../../auth/auth-middleware';

const router = express.Router() as any;

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.getOrgWorkspaces,
);

router.get(
  '/:orgId/templates',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.getOrgWorkspaceTemplates,
);

router.post(
  '/:orgId',
  bodyParser.json(),
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.addWorkspace,
);

router.get(
  '/:orgId/:workspaceId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.getWorkspace,
);

router.delete(
  '/:orgId/:workspaceId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.deleteWorkspace,
);

router.put(
  '/:orgId/:workspaceId',
  bodyParser.json(),
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.updateWorkspace,
);

router.get(
  '/:orgId/:workspaceId/dashboards',
  requireOrgAccess,
  requireWorkspaceAccess,
  KibanaApi.connect,
  controller.getWorkspaceDashboards,
);

export default router;
