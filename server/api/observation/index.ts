import express from 'express';
import getController from './type/observation-type-get.controller';
import deleteController from './type/observation-type-delete.controller';


const router = express.Router() as any;

router.get('/type', getController.getAllObservationTypes);
router.delete('/type/:type', deleteController.deleteObservationType);

export default router;
