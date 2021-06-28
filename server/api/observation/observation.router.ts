import express from 'express';
import getObservationController from './observation.controller.get';
import createObservationController from './observation.controller.create';
import { requireInternalUser } from '../../auth';


const observationRouter = express.Router() as any;

observationRouter.get('/', requireInternalUser, getObservationController.getAllObservations);
observationRouter.post('/', requireInternalUser, express.json(), createObservationController.createObservation);


export default observationRouter;
