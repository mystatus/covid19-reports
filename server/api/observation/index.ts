import express from 'express';
// TODO these roles are probably not right
import { requireInternalUser } from '../../auth';
import controller from './observation.controller';

const router = express.Router() as any;

router.get(
  '/',
  requireInternalUser,
  controller.getObservation,
);


export default router;
