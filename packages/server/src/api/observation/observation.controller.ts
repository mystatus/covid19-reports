import { Request, Response } from 'express';
import { EntityManager, getConnection } from 'typeorm';
import { CustomColumns, RosterInfo } from '@covid19-reports/shared';
import { Report } from './observation.types';
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

  async createObservation(req: ApiRequest<EdipiParam, Report>, res: Response) {
    Log.info('Creating observation', req.body);

    const { EDIPI, ReportType, Timestamp } = assertRequestBody(req, ['EDIPI', 'Timestamp', 'ID']);
    const rosters = await getRosterInfosForIndividualOnDate(EDIPI, `${Timestamp}`);

    if (rosters?.length !== 1) {
      Log.error(`Unable to save observation. Individual exists on ${rosters?.length} rosters. From:`, req.body);
      throw new BadRequestError('Unable to save observation');
    }

    const observation = await getConnection().transaction(async manager => {
      const roster = rosters[0];
      if (!hasReportingGroup(roster, getReportingGroup(req))) {
        Log.error('Unable to find reporting group from:', req.body);
        throw new BadRequestError('Reporting group not found.');
      }

      const reportSchema = await findReportSchema(ReportType, roster.unit.org?.id);
      if (!reportSchema) {
        Log.error(`Unable to find report schema ('${ReportType}') from:`, req.body);
        throw new BadRequestError('ReportType not found.');
      }

      await saveRosterPhoneNumber(EDIPI, `${req.body.Details?.PhoneNumber ?? ''}`, manager);
      return saveObservationWithReportSchema(req, reportSchema, manager);
    });

    res.json(observation);
  }

}

function hasReportingGroup(rosterInfo: RosterInfo, reportingGroup: string | undefined) {
  return reportingGroup && rosterInfo.unit.org?.reportingGroup === reportingGroup;
}

function findReportSchema(reportSchemaId?: string, orgId?: number) {
  return ReportSchema.findOne({
    relations: ['org'],
    where: {
      id: reportSchemaId || 'es6ddssymptomobs',
      org: orgId,
    },
  });
}

function getReportingGroup(req: ApiRequest<EdipiParam, Report>) {
  return req.body.ReportingGroup || (req.body.Client?.Application && applicationMapping[req.body.Client?.Application]);
}

function saveObservationWithReportSchema(req: ApiRequest<EdipiParam, Report>, reportSchema: ReportSchema, manager: EntityManager) {
  const observation = new Observation();
  const { ID, EDIPI, ReportingGroup, ReportType, Timestamp, ...customColumns } = req.body;
  observation.documentId = req.body.ID;
  observation.edipi = req.body.EDIPI;
  observation.timestamp = timestampColumnTransformer.to(req.body.Timestamp);
  observation.reportSchema = reportSchema;
  observation.unit = `${req.body.Details?.Unit ?? ''}`;
  observation.reportingGroup = getReportingGroup(req);
  observation.customColumns = customColumns as unknown as CustomColumns;
  Log.info(`Saving new observation for ${observation.documentId} documentId`);
  return manager.save(observation);
}

export default new ObservationController(Observation);
