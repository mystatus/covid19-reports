import express from 'express';
import bodyParser from 'body-parser';
import getObservationTypeController from './type/observation-type-get.controller';
import deleteObservationTypeController from './type/observation-type-delete.controller';
import createObservationTypeController from './type/observation-type-create.controller';
import getObservationController from './observation-get.controller';
import createObservationController from './observation-create.controller';

const observationRouter = express.Router() as any;

/* Observation */
observationRouter.get('/', getObservationController.getAllObservations);
observationRouter.post('/', bodyParser.json(), createObservationController.createObservation);

/* Observation Type */
observationRouter.get('/type', getObservationTypeController.getAllObservationTypes);
observationRouter.delete('/type/:type', deleteObservationTypeController.deleteObservationType);
observationRouter.post('/type/:type', createObservationTypeController.createObservationType);

export default observationRouter;
