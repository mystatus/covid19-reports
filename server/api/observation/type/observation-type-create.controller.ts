import { Request, Response } from 'express';
import { ObservationType } from './observation-type.model';

function toObservationType(type: string) {
  const observationType = new ObservationType();
  observationType.type = type;
  return observationType;
}

class ObservationTypeCreateController {
  async createObservationType(req: Request, res: Response) {
    return res.json(await ObservationType.save(toObservationType(req.params.type)));
  }
}


export default new ObservationTypeCreateController();
