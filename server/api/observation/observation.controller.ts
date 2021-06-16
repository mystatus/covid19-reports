import { Response } from 'express';
import { ApiRequest, OrgParam } from '../index';

class ObservationController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getObservation(req: ApiRequest<OrgParam>, res: Response) {
    return 'Hello World';
  }
}


export default new ObservationController();
