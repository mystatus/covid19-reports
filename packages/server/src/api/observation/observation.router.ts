import express from 'express';
import bodyParser from 'body-parser';
import controller from './observation.controller';
import { requireInternalUser } from '../../auth/auth-middleware';

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

controller.registerEntityRoutes(
  router,
  {
    hasVersionedColumns: true,
  },
);

export default router;
