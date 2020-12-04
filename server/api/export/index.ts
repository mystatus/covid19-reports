import { Router } from 'express';
import {
  requireOrgAccess,
  requireRolePermission,
} from '../../auth';
import controller from './export.controller';

const router = Router() as any;

router.get(
  '/:orgId/elasticsearch',
  requireOrgAccess,
  controller.exportOrgToCsv,
);

router.get(
  '/:orgId/roster',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.exportRosterToCsv,
);

router.get(
  '/:orgId/muster/individuals',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  controller.exportMusterIndividualsToCsv,
);

export default router;
