import express from 'express';
import { requireInternalUser, requireOrgAccess, requireRolePermission } from '../../auth';
import controller from './muster.controller';

const router = express.Router() as any;

router.get(
  '/closed',
  requireInternalUser,
  controller.getClosedMusterWindows,
);

router.get(
  '/:orgId/:unitId/nearest',
  requireInternalUser,
  requireOrgAccess,
  controller.getNearestMusterWindow,
);

router.get(
  '/:orgId/roster',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  controller.getMusterRoster,
);

router.get(
  '/:orgId/unit-trends',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  controller.getMusterUnitTrends,
);

export default router;
