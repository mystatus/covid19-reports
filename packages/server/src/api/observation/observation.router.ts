import express from 'express';
import bodyParser from 'body-parser';
import controller from './observation.controller';
import { requireInternalUser, requireOrgAccess } from '../../auth/auth-middleware';

const router = express.Router() as any;

router.get(
  '/',
  requireInternalUser,
  controller.getAllObservations,
);

router.post(
  '/',
  requireInternalUser,
  bodyParser.json(),
  controller.createObservation,
);

router.get(
  '/:orgId/allowed-column',
  requireOrgAccess,
  // requireRolePermission(role => role.canViewObservations),
  controller.getAllowedColumnsInfo,
);

router.get(
  '/:orgId',
  requireOrgAccess,
  // requireRolePermission(role => role.canViewObservations),
  controller.getObservations,
);

router.post(
  '/:orgId',
  requireOrgAccess,
  // requireRolePermission(role => role.canViewObservations),
  bodyParser.json(),
  controller.searchObservations,
);


export default router;
