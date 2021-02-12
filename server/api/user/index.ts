import express from 'express';
import bodyParser from 'body-parser';
import controller from './user.controller';
import { requireOrgAccess, requireRolePermission } from '../../auth';

const router = express.Router() as any;

router.get(
  '/current',
  controller.current,
);

router.post(
  '/',
  bodyParser.json(),
  controller.registerUser,
);

router.get(
  '/access-requests',
  controller.getAccessRequests,
);

router.post(
  '/:orgId',
  bodyParser.json(),
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.upsertUser,
);

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.getOrgUsers,
);

router.delete(
  '/:orgId/:edipi',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.removeUserFromGroup,
);

export default router;
