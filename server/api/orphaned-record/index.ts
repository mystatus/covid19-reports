import express from 'express';
import bodyParser from 'body-parser';
import controller from './orphaned-record.controller';
import { requireInternalUser, requireOrgAccess, requireRolePermission } from '../../auth';


const router = express.Router() as any;

router.get(
  '/:orgId',
  requireOrgAccess,
  controller.getOrphanedRecords,
);

router.put(
  '/',
  requireInternalUser,
  controller.addOrphanedRecord,
);

// router.post(
//   '/:orgId',
//   requireOrgAccess,
//   requireRolePermission(role => role.canManageGroup),
//   bodyParser.json(),
//   controller.addUnit,
// );

// router.put(
//   '/:orgId/:unitId',
//   requireOrgAccess,
//   requireRolePermission(role => role.canManageGroup),
//   bodyParser.json(),
//   controller.updateUnit,
// );

// router.delete(
//   '/:orgId/:unitId',
//   requireOrgAccess,
//   requireRolePermission(role => role.canManageGroup),
//   controller.deleteUnit,
// );

// router.get(
//   '/:orgId/:unitId/roster',
//   requireInternalUser,
//   requireOrgAccess,
//   controller.getUnitRoster,
// );

export default router;
