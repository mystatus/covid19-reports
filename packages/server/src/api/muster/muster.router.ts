import bodyParser from 'body-parser';
import express from 'express';
import { requireInternalUser, requireOrgAccess, requireRolePermission } from '../../auth/auth-middleware';
import controller from './muster.controller';
import masterPostgresController from './muster.postgres.controller';

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
  masterPostgresController.getUserMusterCompliance,
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
