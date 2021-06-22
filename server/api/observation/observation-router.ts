import express from 'express';
import getObservationTypeController from './type/observation-type-get.controller';
import deleteObservationTypeController from './type/observation-type-delete.controller';
import createObservationTypeController from './type/observation-type-create.controller';
import getObservationController from './observation-get.controller';

const observationRouter = express.Router() as any;

observationRouter.get('/type', getObservationTypeController.getAllObservationTypes);
observationRouter.delete('/type/:type', deleteObservationTypeController.deleteObservationType);
observationRouter.post('/type/:type', createObservationTypeController.createObservationType);
observationRouter.get('/', getObservationController.getAllObservations);

export default observationRouter;
