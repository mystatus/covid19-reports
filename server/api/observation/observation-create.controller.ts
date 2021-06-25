import { getManager } from 'typeorm';
import { Request, Response } from 'express';

class ObservationCreateController {
  async createObservation(req: Request, res: Response) {
    return res.json(await createObservation(req));
  }
}

async function createObservation(req: Request) {
  // getManager().query() does not return the inserted result
  await getManager()
    .query(
      'INSERT INTO public.observation(document_id, edipi, timestamp, unit_id, unit, type_id, type_org)'
      + 'VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [req.body.documentId, req.body.edipi, req.body.timestamp, req.body.unitId, req.body.unit, req.body.type_id, req.body.type_org],
    );
}


export default new ObservationCreateController();
