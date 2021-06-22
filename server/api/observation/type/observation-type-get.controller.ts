import { Request, Response } from 'express';
import { ObservationType } from './observation-type.model';

class ObservationTypeGetController {
  async getAllObservationTypes(req: Request, res: Response) {
    return res.json(await ObservationType.find());
  }
}


export default new ObservationTypeGetController();
