import { Request, Response } from 'express';
import { EntityManager, getConnection } from 'typeorm';
import { ObservationApiModel } from './observation.types';
import { Observation } from './observation.model';
import { ApiRequest, EdipiParam } from '../api.router';
import { Log } from '../../util/log';
import { ReportSchema } from '../report-schema/report-schema.model';
import { RosterInfo, getRosterInfosForIndividualOnDate} from '../roster/roster.controller';
import { timestampColumnTransformer } from '../../util/util';
import { BadRequestError } from '../../util/error-types';
import { assertRequestBody } from '../../util/api-utils';
import { saveRosterPhoneNumber } from '../roster/roster-utils';


class ObservationController {
  async getAllObservations(req: Request, res: Response) {
    return res.json(await Observation.find());
  }

  async createObservation(req: ApiRequest<EdipiParam, ObservationApiModel>, res: Response) {
    Log.info('Creating observation', req.body);

    const { reportingGroup, reportSchemaId, edipi, timestamp, phoneNumber } = assertRequestBody(req, [
      'reportSchemaId',
      'edipi',
      'timestamp',
      'phoneNumber',
    ]);

    const rosters: RosterInfo[] = await getRosterInfosForIndividualOnDate(edipi, `${timestamp}`);

    if (!rosters || rosters.length === 0) {
      Log.error(`Unable to save observation from: ${req.body}`);
      throw new BadRequestError('Unable to save observation');
    }

    await getConnection().transaction(async transactionalEntityManager => {
      for (const roster of rosters) {
        if (hasReportingGroup(roster, reportingGroup)) {
          const reportSchema = await findReportSchema(reportSchemaId, roster.unit.org?.id);
          if (reportSchema) {
            await saveRosterPhoneNumber(edipi, phoneNumber, transactionalEntityManager);
            return res.json(saveObservationWithReportSchema(req, reportSchema, transactionalEntityManager));
          }
        }
      }
    });
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

async function saveObservationWithReportSchema(req: ApiRequest<EdipiParam, ObservationApiModel>, rs: ReportSchema, em: EntityManager) {
  const observation = new Observation();
  observation.documentId = req.body.documentId;
  observation.edipi = req.body.edipi;
  observation.timestamp = timestampColumnTransformer.to(req.body.timestamp);
  observation.reportSchema = rs;
  observation.unit = req.body.unit;
  observation.reportingGroup = req.body.reportingGroup;
  Log.info(`Saving new observation for ${observation.documentId} documentId`);
  return em.save(observation);
}

export default new ObservationController();
