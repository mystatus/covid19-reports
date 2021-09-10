import bodyParser from 'body-parser';
import express from 'express';
import { requireInternalUser, requireOrgAccess, requireRolePermission } from '../../auth/auth-middleware';
import controller from './muster.controller';

const router = express.Router() as any;

router.get(
  '/closed',
  requireInternalUser,
  controller.getClosedMusterWindows,
);

router.get(
  '/:orgId',
  requireOrgAccess,
  controller.getMusterConfigurations,
);

router.post(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.addMusterConfiguration,
);

router.get(
  '/:orgId/unit-trends',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  controller.getMusterUnitTrends,
);

router.put(
  '/:orgId/:musterConfigurationId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.updateMusterConfiguration,
);

router.delete(
  '/:orgId/:musterConfigurationId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.deleteMusterConfiguration,
);

router.get(
  '/:orgId/:edipi/nearest',
  requireInternalUser,
  requireOrgAccess,
  controller.getNearestMusterWindow,
);

router.get(
  '/:orgId/roster/complianceByDateRange',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  controller.getRosterMusterComplianceByDateRange,
);

router.get(
  '/:orgId/:filterId/complianceByDateRange',
  bodyParser.json(),
  controller.getFilterMusterComplianceByDateRange,
);

export default router;
