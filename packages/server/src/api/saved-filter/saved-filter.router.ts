import express from 'express';
import bodyParser from 'body-parser';
import controller from './saved-filter.controller';
import { requireOrgAccess, requireRolePermission } from '../../auth/auth-middleware';

const router = express.Router() as any;

router.get(
  '/:orgId',
  requireOrgAccess,
  controller.getSavedFilters,
);

router.post(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.addSavedFilter,
);

router.put(
  '/:orgId/:savedFilterId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.updateSavedFilter,
);

router.delete(
  '/:orgId/:savedFilterId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.deleteSavedFilter,
);

export default router;
