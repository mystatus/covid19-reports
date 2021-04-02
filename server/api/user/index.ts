import express from 'express';
import bodyParser from 'body-parser';
import { KibanaApi } from '../../kibana/kibana-api';
import controller from './user.controller';
import {
  requireOrgAccess,
  requireRolePermission,
  requireWorkspaceAccess,
} from '../../auth';

const router = express.Router() as any;

router.get(
  '/current',
  controller.current,
);

router.post(
  '/',
  bodyParser.json(),
  controller.registerUser,
);

router.get(
  '/access-requests',
  controller.getAccessRequests,
);

router.post(
  '/:orgId',
  bodyParser.json(),
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.upsertUser,
);

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.getOrgUsers,
);

router.delete(
  '/:orgId/:edipi',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.removeUserFromGroup,
);

router.post(
  '/:orgId/favorite-dashboards/:workspaceId/:dashboardUuid',
  requireOrgAccess,
  requireWorkspaceAccess,
  KibanaApi.connect,
  controller.addFavoriteDashboard,
);

router.delete(
  '/:orgId/favorite-dashboards/:workspaceId/:dashboardUuid',
  requireOrgAccess,
  requireWorkspaceAccess,
  controller.removeFavoriteDashboard,
);

export default router;
