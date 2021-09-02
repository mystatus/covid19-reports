import { Request, Response } from 'express';
import { EntityManager, getConnection } from 'typeorm';
import { RosterInfo } from '@covid19-reports/shared';
import { ObservationApiModel, ObservationApiRawReportModel } from './observation.types';
import { Observation } from './observation.model';
import { ApiRequest, EdipiParam } from '../api.router';
import { Log } from '../../util/log';
import { ReportSchema } from '../report-schema/report-schema.model';
import { getRosterInfosForIndividualOnDate } from '../roster/roster.controller';
import { timestampColumnTransformer } from '../../util/util';
import { BadRequestError } from '../../util/error-types';
import { assertRequestBody } from '../../util/api-utils';
import { saveRosterPhoneNumber } from '../../util/roster-utils';
import { EntityController } from '../../util/entity-utils';

export const applicationMapping: {[key: string]: string} = {
  dawn: 'trsg',
  goose: 'cnal',
  hawkins: 'nsw',
  manta: 'csp',
  padawan: 'nbsd',
  roadrunner: 'nmtsc',
  niima: 'cldj',
  nashal: 'nhfl',
  corvair: 'ccsg',
  crix: 'arng',
  nova: 'necc',
  fondor: 'usff',
  wurtz: 'c7f',
  jun: 'oki',
  jerjerrod: 'naveur',
  javaal: 'usaf',
  sabaoth: 'usaf',
  trando: 'usn_embark',
  crait: 'first_army_test',
  coronet: 'c19_test',
} as const;

class ObservationController extends EntityController<Observation> {

  async getAllObservations(req: Request, res: Response) {
    return res.json(await Observation.find());
  }

  async createObservation(req: ApiRequest<EdipiParam, ObservationApiRawReportModel>, res: Response) {
    Log.info('Creating observation', req.body);

    assertRequestBody(req, ['EDIPI', 'Timestamp', 'ID']);

    const model = rawReportToObservationApiModel(req.body);
    const { edipi, phoneNumber, reportSchemaId, timestamp } = model;

    const rosters: RosterInfo[] = await getRosterInfosForIndividualOnDate(edipi, `${timestamp}`);

    if (!rosters || rosters.length === 0) {
      Log.error(`Unable to save observation from: ${req.body}`);
      throw new BadRequestError('Unable to save observation');
    }

    const observation = await getConnection().transaction(async manager => {
      for (const roster of rosters) {
        if (hasReportingGroup(roster, getReportingGroup(req))) {
          const reportSchema = await findReportSchema(reportSchemaId, roster.unit.org?.id);
          if (reportSchema) {
            await saveRosterPhoneNumber(edipi, phoneNumber, manager);
            return saveObservationWithReportSchema(req, reportSchema, manager);
          }
        }
      }

      return undefined;
    });

    res.json(observation);
  }

}

function hasReportingGroup(rosterInfo: RosterInfo, reportingGroup: string | undefined) {
  return reportingGroup && rosterInfo.unit.org?.reportingGroup === reportingGroup;
}

function findReportSchema(reportSchemaId: string, orgId: number | undefined) {
  return ReportSchema.findOne({
    relations: ['org'],
    where: {
      id: reportSchemaId,
      org: orgId,
    },
  });
}

function rawReportToObservationApiModel(raw: ObservationApiRawReportModel): ObservationApiModel {
  return {
    edipi: raw.EDIPI,
    timestamp: raw.Timestamp,
    documentId: raw.ID,
    reportSchemaId: raw.ReportType || 'es6ddssymptomobs',
    unit: raw.Details?.Unit ?? '',
    phoneNumber: raw.Details?.PhoneNumber ?? '',
  };
}

function getReportingGroup(req: ApiRequest<EdipiParam, ObservationApiRawReportModel>) {
  return req.body.ReportingGroup || (req.body.Client?.Application && applicationMapping[req.body.Client?.Application]);
}

function saveObservationWithReportSchema(req: ApiRequest<EdipiParam, ObservationApiRawReportModel>, reportSchema: ReportSchema, manager: EntityManager) {
  const observation = new Observation();
  observation.documentId = req.body.ID;
  observation.edipi = req.body.EDIPI;
  observation.timestamp = timestampColumnTransformer.to(req.body.Timestamp);
  observation.reportSchema = reportSchema;
  observation.unit = req.body.Details?.Unit ?? '';
  observation.reportingGroup = getReportingGroup(req);
  Log.info(`Saving new observation for ${observation.documentId} documentId`);
  return manager.save(observation);
}

export default new ObservationController(Observation);
