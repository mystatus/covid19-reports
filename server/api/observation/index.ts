import express from 'express';
import getController from './type/observation-type-get.controller';
import deleteController from './type/observation-type-delete.controller';
import createController from './type/observation-type-create.controller';

const router = express.Router() as any;

router.get('/type', getController.getAllObservationTypes);
router.delete('/type/:type', deleteController.deleteObservationType);
router.post('/type/:type', createController.createObservationType);

export default router;
