import express from 'express';
import getController from './type/observation-type-get.controller';
import deleteController from './type/observation-type-delete.controller';
import createController from './type/observation-type-create.controller';

const observationRouter = express.Router() as any;

observationRouter.get('/type', getController.getAllObservationTypes);
observationRouter.delete('/type/:type', deleteController.deleteObservationType);
observationRouter.post('/type/:type', createController.createObservationType);

export default observationRouter;
