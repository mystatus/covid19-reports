import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { ObservationApiModel } from './observation.types';
import { Observation } from './observation.model';
import { ApiRequest, EdipiParam } from '../api.router';
import { timestampColumnTransformer } from '../../util/util';

class ObservationController {
  async getAllObservations(req: Request, res: Response) {
    return res.json(await Observation.find());
  }

  async createObservation(req: ApiRequest<EdipiParam, ObservationApiModel>, res: Response) {
    return res.json(await createObservation(req));
  }
}

async function createObservation(req: ApiRequest<EdipiParam, ObservationApiModel>) {
  // getManager().query() does not return the inserted row
  console.log(`Creating observation ${JSON.stringify(req.body)}`);
  await getManager()
    .query(
      'INSERT INTO public.observation(document_id, edipi, timestamp, unit_id, unit, type_id, type_org)'
      + 'VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [req.body.documentId, req.body.edipi, timestampColumnTransformer.to(req.body.timestamp),
        req.body.unitId, req.body.unit, req.body.typeId, req.body.orgId],
    );
}

export default new ObservationController();
