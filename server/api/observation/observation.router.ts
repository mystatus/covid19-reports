import express from 'express';
import getObservationController from './observation.controller';
import createObservationController from './observation.controller';
import { requireInternalUser } from '../../auth';


const observationRouter = express.Router() as any;

observationRouter.get('/', requireInternalUser, getObservationController.getAllObservations);
observationRouter.post('/', requireInternalUser, express.json(), createObservationController.createObservation);


export default observationRouter;
