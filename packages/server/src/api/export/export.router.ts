import { Router } from 'express';
import {
  requireOrgAccess,
  requireRolePermission,
} from '../../auth/auth-middleware';
import sqlController from './export.sql.controller';

const router = Router() as any;

router.get(
  '/:orgId/sql',
  requireOrgAccess,
  sqlController.exportOrgToCsv,
);

router.get(
  '/:orgId/roster/sql',
  requireOrgAccess,
  sqlController.exportRosterToCsv,
);

router.get(
  '/:orgId/muster/roster/sql',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  sqlController.exportRosterMusterComplianceToCsv,
);

export default router;
