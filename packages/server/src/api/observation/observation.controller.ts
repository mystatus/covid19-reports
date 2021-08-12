import { Request, Response } from 'express';
import { EntityManager, getConnection } from 'typeorm';
import { Paginated, PaginationParams, RosterInfo, SearchBody } from '@covid19-reports/shared';
import { ObservationApiModel } from './observation.types';
import { Observation } from './observation.model';
import { ApiRequest, EdipiParam, OrgParam } from '../api.router';
import { Log } from '../../util/log';
import { ReportSchema } from '../report-schema/report-schema.model';
import { getRosterInfosForIndividualOnDate } from '../roster/roster.controller';
import { timestampColumnTransformer } from '../../util/util';
import { BadRequestError } from '../../util/error-types';
import { assertRequestBody } from '../../util/api-utils';
import { saveRosterPhoneNumber } from '../../util/roster-utils';
import { EntityService } from '../../util/entity-utils';

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

    const observation = await getConnection().transaction(async manager => {
      for (const roster of rosters) {
        if (hasReportingGroup(roster, reportingGroup)) {
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


  async getAllowedColumnsInfo(req: ApiRequest<OrgParam>, res: Response) {
    const service = new EntityService(Observation);
    const columns = service.filterAllowedColumns(await Observation.getColumns(req.appOrg!, 'es6ddssymptomobs'), req.appUserRole!.role);
    res.json(columns);
  }

  async getObservations(req: ApiRequest<OrgParam, any, PaginationParams>, res: Response<Paginated<Observation>>) {
    const service = new EntityService(Observation);
    res.json(await service.search(req.query, req.appOrg!, req.appUserRole!));
  }

  async searchObservations(req: ApiRequest<OrgParam, SearchBody, PaginationParams>, res: Response<Paginated<Observation>>) {
    const service = new EntityService(Observation);
    res.json(await service.search(req.query, req.appOrg!, req.appUserRole!, req.body));
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

function saveObservationWithReportSchema(req: ApiRequest<EdipiParam, ObservationApiModel>, reportSchema: ReportSchema, manager: EntityManager) {
  const observation = new Observation();
  observation.documentId = req.body.documentId;
  observation.edipi = req.body.edipi;
  observation.timestamp = timestampColumnTransformer.to(req.body.timestamp);
  observation.reportSchema = reportSchema;
  observation.unit = req.body.unit;
  observation.reportingGroup = req.body.reportingGroup;
  Log.info(`Saving new observation for ${observation.documentId} documentId`);
  return manager.save(observation);
}

export default new ObservationController();
