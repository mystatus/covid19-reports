import { Request, Response } from 'express';
import { ObservationType } from './observation-type.model';

class ObservationTypeDeleteController {
  async deleteObservationType(req: Request, res: Response) {
    return res.json(await ObservationType.delete({ type: req.params.type }));
  }
}


export default new ObservationTypeDeleteController();
