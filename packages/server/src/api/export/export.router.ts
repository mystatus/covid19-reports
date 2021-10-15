import { Router } from 'express';
import {
  requireOrgAccess,
  requireRolePermission,
} from '../../auth/auth-middleware';
import controller from './export.controller';

const router = Router() as any;

router.get(
  '/:orgId/sql',
  requireOrgAccess,
  requireRolePermission(role => role.canViewObservation),
  controller.exportOrgToCsv,
);

router.get(
  '/:orgId/roster/sql',
  requireOrgAccess,
  requireRolePermission(role => role.canViewRoster),
  controller.exportRosterToCsv,
);

router.get(
  '/:orgId/muster/roster/sql',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  controller.exportRosterMusterComplianceToCsv,
);

export default router;
