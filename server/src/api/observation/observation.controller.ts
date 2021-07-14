import { Request, Response } from 'express';
import { ObservationApiModel } from './observation.types';
import { Observation } from './observation.model';
import { ApiRequest, EdipiParam } from '../api.router';
import { Log } from '../../util/log';
import { ReportSchema } from '../report-schema/report-schema.model';
import { RosterInfo, getRostersForIndividual } from '../roster/roster.controller';
import { timestampColumnTransformer } from '../../util/util';
import { BadRequestError } from '../../util/error-types';
import { assertRequestBody } from '../../util/api-utils';


class ObservationController {
  async getAllObservations(req: Request, res: Response) {
    return res.json(await Observation.find());
  }

  async createObservation(req: ApiRequest<EdipiParam, ObservationApiModel>, res: Response) {
    Log.info('Creating observation', req.body);

    const { reportingGroup, reportSchemaId, edipi, timestamp } = assertRequestBody(req, [
      'reportSchemaId',
      'edipi',
      'timestamp',
    ]);

    const rosters: RosterInfo[] = await getRostersForIndividual(edipi, timestamp.toString(10));

    for (const roster of rosters) {
      if (hasReportingGroup(roster, reportingGroup)) {
        const reportSchema = await findReportSchema(reportSchemaId, roster.unit.org?.id);
        if (reportSchema) {
          return res.json(saveObservationWithReportSchema(req, reportSchema));
        }
      }
    }
    Log.error(`Unable to save observation from: ${req.body}`);
    throw new BadRequestError('Unable to save observation');
  }
}

function hasReportingGroup(rosterInfo: RosterInfo, reportingGroup: string | undefined) {
  return reportingGroup && rosterInfo.unit.org?.reportingGroup === reportingGroup;
}

async function findReportSchema(reportSchemaId: string, orgId: number | undefined) {
  return ReportSchema.findOne({
    relations: ['org'],
    where: {
      id: reportSchemaId,
      org: orgId,
    },
  });
}

async function saveObservationWithReportSchema(req: ApiRequest<EdipiParam, ObservationApiModel>, reportSchema: ReportSchema) {
  const observation = new Observation();
  observation.documentId = req.body.documentId;
  observation.edipi = req.body.edipi;
  observation.timestamp = timestampColumnTransformer.to(req.body.timestamp);
  observation.reportSchema = reportSchema;
  observation.unit = req.body.unit;
  observation.reportingGroup = req.body.reportingGroup;
  Log.info(`Saving new observation for ${observation.documentId} documentId`);
  return observation.save();
}

export default new ObservationController();
