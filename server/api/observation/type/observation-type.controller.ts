import { Request, Response } from 'express';
import { ObservationType } from './observation-type.model';

class ObservationTypeController {
  async getAllObservationTypes(req: Request, res: Response) {
    return res.json(await ObservationType.find());
  }
}


export default new ObservationTypeController();
