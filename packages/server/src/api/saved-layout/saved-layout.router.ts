import express from 'express';
import bodyParser from 'body-parser';
import controller from './saved-layout.controller';
import { requireOrgAccess, requireRolePermission } from '../../auth/auth-middleware';

const router = express.Router() as any;

router.get(
  '/:orgId',
  requireOrgAccess,
  controller.getSavedLayouts,
);

router.post(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.addSavedLayout,
);

router.put(
  '/:orgId/:savedLayoutId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.updateSavedLayout,
);

router.delete(
  '/:orgId/:savedLayoutId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.deleteSavedLayout,
);

export default router;
