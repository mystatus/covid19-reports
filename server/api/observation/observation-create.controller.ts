import { Request, Response } from 'express';
import { Observation } from './observation.model';
import { ObservationType } from './type/observation-type.model';

class ObservationCreateController {
  async createObservation(req: Request, res: Response) {
    return res.json(await toObservation(req).save());
  }
}

function toObservation(req: Request) {
  const observation = new Observation();
  observation.documentId = req.body.documentId;
  observation.edipi = req.body.edipi;
  observation.timestamp = req.body.timestamp;
  observation.unitId = req.body.unitId;
  observation.unit = req.body.unit;
  observation.orgId = req.body.orgId;
  observation.type = new ObservationType();
  observation.type.type = req.body.type;
  return observation;
}


export default new ObservationCreateController();
