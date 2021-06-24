import { Request, Response } from 'express';
import { Observation } from './observation.model';

class ObservationGetController {
  async getAllObservations(req: Request, res: Response) {
    return res.json(await Observation.find());
  }
}


export default new ObservationGetController();
