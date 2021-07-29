import { Response } from 'express';
import { Log } from '../../util/log';
import { ApiRequest, EdipiParam } from '../api.router';
import { InternalServerError } from '../../util/error-types';
import { reingestByEdipi } from '../../util/reingest-utils';


class ReingestController {

  async reingestSymptomRecords(req: ApiRequest<EdipiParam, TimestampData>, res: Response) {
    try {
      const {
        lambdaInvocationCount,
        recordsIngested,
      } = await reingestByEdipi(req.params.edipi, req.body.startTime, req.body.endTime);

      res.status(201).json({
        'reingest-count': recordsIngested,
        'lambda-invoke-count': lambdaInvocationCount,
      });
    } catch (err) {
      Log.info('Reingest Failed: ', err.message);
      throw new InternalServerError(`Error during reingest request: ${err.message}`);
    }
  }

}

interface TimestampData {
  startTime?: string | number | Date;
  endTime?: string | number | Date;
}

export default new ReingestController();
