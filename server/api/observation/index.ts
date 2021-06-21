import express from 'express';
import controller from './type/observation-type.controller';


const router = express.Router() as any;

router.get('/type', controller.getAllObservationTypes);

export default router;
