import express from 'express';
import controller from './orphaned-record.controller';
import { requireInternalUser, requireOrgAccess, requireRolePermission } from '../../auth';


const router = express.Router() as any;

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.getOrphanedRecords,
);

router.put(
  '/',
  requireInternalUser,
  requireOrgAccess,
  controller.addOrphanedRecord,
);

router.delete(
  '/:orgId/:id',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.deleteOrphanedRecord,
);

router.put(
  '/:orgId/:id/resolve',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.resolveOrphanedRecord,
);

router.put(
  '/:orgId/:id/action',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.addOrphanedRecordAction,
);


export default router;
