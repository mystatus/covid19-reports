import { Request, Response } from 'express';
import { ObservationType } from './observation-type.model';

class ObservationTypeCreateController {
  async createObservationType(req: Request, res: Response) {
    return res.json(await ObservationType.save(toObservationType(req.params.type)));
  }
}

function toObservationType(type: string) {
  const observationType = new ObservationType();
  observationType.type = type;
  return observationType;
}


export default new ObservationTypeCreateController();
