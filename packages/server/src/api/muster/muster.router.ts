import bodyParser from 'body-parser';
import express from 'express';
import { requireInternalUser, requireOrgAccess, requireRolePermission } from '../../auth/auth-middleware';
import controller from './muster.controller';
import musterPostgresController from './muster.postgres.controller';

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

const musterController = process.env.MUSTER_POSTGRES_CONTROLLER !== 'true' ? controller.getMusterRoster : musterPostgresController.getUserMusterCompliance;
router.get(
  '/:orgId/roster',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  musterController,
);

router.get(
  '/:orgId/unit-trends',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  controller.getMusterUnitTrends,
);

router.get(
  '/:orgId/:unitName/complianceByDate',
  bodyParser.json(),
  controller.getMusterComplianceByDate,
);

router.get(
  '/:orgId/:unitName/complianceByDateRange',
  bodyParser.json(),
  controller.getMusterComplianceByDateRange,
);

export default router;
