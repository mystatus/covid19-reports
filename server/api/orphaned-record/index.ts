import express from 'express';
import bodyParser from 'body-parser';
import controller from './orphaned-record.controller';
import { requireInternalUser, requireOrgAccess, requireRolePermission } from '../../auth';


const router = express.Router() as any;

router.get(
  '/:orgId/count',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.getOrphanedRecordsCount,
);

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.getOrphanedRecords,
);

router.put(
  '/',
  requireInternalUser,
  bodyParser.json(),
  controller.addOrphanedRecord,
);

router.delete(
  '/:orgId/:orphanId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.deleteOrphanedRecord,
);

router.put(
  '/:orgId/:orphanId/resolve-with-add',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  bodyParser.json(),
  controller.resolveOrphanedRecordWithAdd,
);

router.put(
  '/:orgId/:orphanId/resolve-with-edit',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  bodyParser.json(),
  controller.resolveOrphanedRecordWithEdit,
);

router.put(
  '/:orgId/:orphanId/action',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  bodyParser.json(),
  controller.addOrphanedRecordAction,
);

router.delete(
  '/:orgId/:orphanId/:action',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  bodyParser.json(),
  controller.deleteOrphanedRecordAction,
);


export default router;
