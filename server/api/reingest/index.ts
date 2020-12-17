import express from 'express';
import bodyParser from 'body-parser';
import controller from './reingest.controller';
import { requireInternalUser } from '../../auth';

const router = express.Router() as any;

router.post(
  '/:edipi',
  requireInternalUser,
  bodyParser.json(),
  controller.reingestSymptomRecords,
);

export default router;
