import { Router } from 'express';
import {
  requireOrgAccess,
  requireRolePermission,
} from '../../auth/auth-middleware';
import esController from './export.elasticsearch.controller';
import sqlController from './export.sql.controller';

const router = Router() as any;

router.get(
  '/:orgId/elasticsearch',
  requireOrgAccess,
  esController.exportOrgToCsv,
);

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
  '/:orgId/roster',
  requireOrgAccess,
  requireRolePermission(role => role.canViewRoster),
  esController.exportRosterToCsv,
);

router.get(
  '/:orgId/muster/roster',
  requireOrgAccess,
  requireRolePermission(role => role.canViewMuster),
  esController.exportMusterRosterToCsv,
);

export default router;
