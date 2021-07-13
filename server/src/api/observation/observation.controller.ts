import { Request, Response } from 'express';
import { ObservationApiModel } from './observation.types';
import { Observation } from './observation.model';
import { ApiRequest, EdipiParam } from '../api.router';
import { Log } from '../../util/log';
import { ReportSchema } from '../report-schema/report-schema.model';
import { RosterInfo, getRostersForIndividual } from '../roster/roster.controller';
import { timestampColumnTransformer } from '../../util/util';


class ObservationController {
  async getAllObservations(req: Request, res: Response) {
    return res.json(await Observation.find());
  }

  async createObservation(req: ApiRequest<EdipiParam, ObservationApiModel>, res: Response) {
    return res.json(await createObservation(req));
  }
}

function hasReportingGroup(roster: RosterInfo, reportingGroup: string | undefined) {
  return reportingGroup && roster.unit.org?.reportingGroup === reportingGroup;
}

async function createObservation(req: ApiRequest<EdipiParam, ObservationApiModel>) {
  Log.info('Creating observation', req.body);

  const reportingGroup = req.body.reportingGroup;
  const rosters: RosterInfo[] = await getRostersForIndividual((req.body.timestamp).toString(10), req.body.edipi);

  for (const roster of rosters) {
    if (hasReportingGroup(roster, reportingGroup)) {

      const reportSchema = await ReportSchema.findOne({
        relations: ['org'],
        where: {
          id: req.body.typeId,
          org: roster.unit.org?.id,
        },
      });

      if (reportSchema) {
        const observation = new Observation();
        observation.documentId = req.body.documentId;
        observation.edipi = req.body.edipi;
        observation.timestamp = timestampColumnTransformer.to(req.body.timestamp);
        observation.type = reportSchema;
        observation.unit = req.body.unit;
        observation.reportingGroup = req.body.reportingGroup;
        Log.info(`Saving new observation for ${observation.documentId} documentId`);
        return observation.save();
      }
    }
  }
  Log.error(`Unable to save observation from: ${req.body}`);
  return Promise.reject(new Observation());
}

export default new ObservationController();
