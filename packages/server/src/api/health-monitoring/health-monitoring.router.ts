import express from 'express';
import controller from './health-monitoring.controller';
import {
  requireOrgAccess,
} from '../../auth/auth-middleware';

const router = express.Router() as any;

router.get(
  '/:orgId',
  requireOrgAccess,
  controller.getHealthMonitoringData,
);

export default router;
