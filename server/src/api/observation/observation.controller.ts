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
  const body = req.body;
  console.log(`Creating observation ${JSON.stringify(body)}`);
  // getManager().query() does not return the inserted row
  const timeStamp = timestampColumnTransformer.to(body.timestamp);
  await getManager()
    .query(
      'INSERT INTO public.observation(document_id, edipi, timestamp, unit, type_id, reporting_group)'
      + 'VALUES ($1, $2, $3, $4, $5, $6)',
      [body.documentId, body.edipi, timeStamp, body.unit, body.typeId, body.reportingGroup],
    );
}

export default new ObservationController();
