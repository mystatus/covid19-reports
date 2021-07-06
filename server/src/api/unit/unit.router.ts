import express from 'express';
import bodyParser from 'body-parser';
import controller from './unit.controller';
import { requireInternalUser, requireOrgAccess, requireRolePermission } from '../../auth/auth-middleware';

const router = express.Router() as any;

router.get(
  '/:orgId',
  requireOrgAccess,
  controller.getUnits,
);

router.post(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.addUnit,
);

router.put(
  '/:orgId/:unitId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.updateUnit,
);

router.delete(
  '/:orgId/:unitId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.deleteUnit,
);

router.get(
  '/:orgId/:unitId/roster',
  requireInternalUser,
  requireOrgAccess,
  controller.getUnitRoster,
);

export default router;
