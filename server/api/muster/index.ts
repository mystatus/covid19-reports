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
  '/:orgId/:unitId/open',
  requireInternalUser,
  requireOrgAccess,
  controller.getOpenMusterWindows,
);

router.get(
  '/:orgId/individuals',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  controller.getIndividuals,
);

router.get(
  '/:orgId/trends',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  controller.getTrends,
);

export default router;
