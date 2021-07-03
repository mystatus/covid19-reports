import express from 'express';
import bodyParser from 'body-parser';
import controller from './observation.controller';
import { requireInternalUser } from '../../auth';

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

export default router;
