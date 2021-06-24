import express from 'express';
import getObservationController from './observation-get.controller';
import createObservationController from './observation-create.controller';


const observationRouter = express.Router() as any;

observationRouter.get('/', getObservationController.getAllObservations);
observationRouter.post('/', express.json(), createObservationController.createObservation);


export default observationRouter;
