import express from 'express';
import { requireOrgAccess, requireRolePermission } from '../../auth';
import controller from './muster.controller';

const router = express.Router() as any;

router.get(
  '/:orgId/individuals',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  controller.getIndividuals,
);

router.get(
  '/:orgId/individuals/export',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  controller.exportIndividuals,
);

router.get(
  '/:orgId/trends',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  controller.getTrends,
);

export default router;
