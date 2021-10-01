import { Request, Response } from 'express';
import { EntityManager, getConnection } from 'typeorm';
import { ColumnType, CustomColumns, MusterStatus } from '@covid19-reports/shared';
import { Report } from './observation.types';
import { Observation } from './observation.model';
import { ApiRequest, EdipiParam } from '../api.router';
import { Log } from '../../util/log';
import { ReportSchema, SchemaColumn } from '../report-schema/report-schema.model';
import { getRosterForIndividualOnDate } from '../roster/roster.controller';
import { dateFromString, timestampColumnTransformer } from '../../util/util';
import { assertRequestBody } from '../../util/api-utils';
import { EntityController } from '../../util/entity-utils';
import { Org } from '../org/org.model';
import { RosterHistory } from '../roster/roster-history.model';
import { BadRequestError } from '../../util/error-types';
import { getNearestMusterWindow, MusterWindow } from '../../util/muster-utils';

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
    const reportingGroup = getReportingGroup(req);
    let observation: Observation | null = null;
    if (reportingGroup) {
      const org = await Org.findOne({
        where: {
          reportingGroup,
        },
      });
      if (org) {
        const muster = await getNearestMusterWindow(org, EDIPI, Timestamp, ReportType ?? 'es6ddssymptomobs');
        const roster = await getRosterForIndividualOnDate(org.id, EDIPI, `${Timestamp}`);
        const reportSchema = await findReportSchema(ReportType, org.id);
        if (reportSchema) {
          observation = await getConnection().transaction(async manager => {
            if (muster) {
              // If they report for the same window twice, remove the previous one
              const existingObservation = await manager.findOne(Observation, {
                where: {
                  edipi: EDIPI,
                  musterWindowId: muster.id,
                },
              });
              if (existingObservation) {
                await manager.remove(existingObservation);
              }
            }
            return saveObservationWithReportSchema(org, req, reportSchema, roster, muster, manager);
          });
        } else {
          Log.error(`Unable to find report schema ('${ReportType}') from:`, req.body);
          throw new BadRequestError('ReportType not found.');
        }
      } else {
        throw new BadRequestError(`Unknown reporting group: ${reportingGroup}`);
      }
    } else {
      Log.error('Unable to find reporting group from:', req.body);
      throw new BadRequestError('Reporting group not found.');
    }
    res.json(observation);
  }

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

function saveObservationWithReportSchema(
  org: Org,
  req: ApiRequest<EdipiParam, Report>,
  reportSchema: ReportSchema,
  roster: RosterHistory | undefined,
  muster: MusterWindow | undefined,
  manager: EntityManager,
) {
  const report = req.body;
  const observation = new Observation();
  observation.documentId = report.ID;
  observation.edipi = report.EDIPI;
  observation.timestamp = timestampColumnTransformer.to(report.Timestamp);
  observation.reportSchema = reportSchema;
  observation.unit = `${report.Details?.Unit ?? ''}`;
  observation.reportingGroup = org.reportingGroup;
  observation.rosterHistoryEntry = roster;
  if (muster) {
    observation.musterWindowId = muster.id;
    observation.musterConfiguration = muster.configuration;
    if (report.Timestamp < muster.startTimestamp) {
      observation.musterStatus = MusterStatus.EARLY;
    } else if (report.Timestamp > muster.endTimestamp) {
      observation.musterStatus = MusterStatus.LATE;
    } else {
      observation.musterStatus = MusterStatus.ON_TIME;
    }
  }
  const customColumns: CustomColumns = {};
  for (const column of reportSchema.columns) {
    customColumns[column.name] = getValueFromKeyPath(report, column);
  }
  observation.customColumns = customColumns;
  Log.info(`Saving new observation for ${observation.documentId} documentId`);
  return manager.save(observation);
}

function getValueFromKeyPath(object: any, column: SchemaColumn) {
  let current: any = object;
  let keyIndex = 0;
  let key = column.keyPath[keyIndex];
  while (keyIndex + 1 < column.keyPath.length) {
    current = current[column.keyPath[keyIndex]];
    if (!current) {
      break;
    }
    keyIndex += 1;
    key = column.keyPath[keyIndex];
  }
  if (current) {
    let value = current[key];
    if ((!value || value === '-') && column.otherField) {
      value = current[`${key}Other`];
    }
    return getColumnValue(column, value);
  }
  return undefined;
}

function getColumnValue(column: SchemaColumn, value: any) {
  if (value == null) {
    return null;
  }
  switch (column.type) {
    case ColumnType.Enum:
    case ColumnType.String:
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return `${value}`;
    case ColumnType.Number:
      return +value;
    case ColumnType.Boolean:
      return Boolean(value).valueOf();
    case ColumnType.Date:
    case ColumnType.DateTime:
      return dateFromString(`${value}`, false)?.toISOString();
    default:
      break;
  }
  return value;
}

export default new ObservationController(Observation);
