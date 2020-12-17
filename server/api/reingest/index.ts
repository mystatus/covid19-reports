import express from 'express';
import bodyParser from 'body-parser';
import controller from './reingest.controller';
import { requireRolePermission } from '../../auth';


const router = express.Router() as any;

router.post(
  '/:edipi',
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.reingestSymptomRecords,
);

export default router;
