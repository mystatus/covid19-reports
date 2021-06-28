import { getManager } from 'typeorm';
import { Response } from 'express';
import { ApiRequest, EdipiParam } from '../index';
import ObservationApiI from './observation.api-i';

class ObservationControllerCreate {
  async createObservation(req: ApiRequest<EdipiParam, ObservationApiI>, res: Response) {
    return res.json(await createObservation(req));
  }
}

async function createObservation(req: ApiRequest<EdipiParam, ObservationApiI>) {
  // getManager().query() does not return the inserted row
  await getManager()
    .query(
      'INSERT INTO public.observation(document_id, edipi, timestamp, unit_id, unit, type_id, type_org)'
      + 'VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [req.body.documentId, req.body.edipi, req.body.timestamp, req.body.unitId, req.body.unit, req.body.typeId, req.body.orgId],
    );
}


export default new ObservationControllerCreate();
