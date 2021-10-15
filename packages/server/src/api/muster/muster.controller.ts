import { Response } from 'express';
import { getConnection, getManager, SelectQueryBuilder } from 'typeorm';
import moment from 'moment-timezone';
import {
  AddMusterConfigurationBody,
  dayIsIn,
  DaysOfTheWeek,
  CloseMusterWindowsQuery,
  GetMusterComplianceByDateRangeQuery,
  GetMusterComplianceByDateRangeResponse,
  GetMusterRosterQuery,
  GetWeeklyMusterTrendsQuery,
  GetNearestMusterWindowQuery,
  MusterConfigurationData,
  MusterStatus,
  nextDay,
  oneDayMilliseconds,
  Paginated,
  UpdateMusterConfigurationBody,
  findColumnByFullyQualifiedName,
} from '@covid19-reports/shared';
import { assertRequestBody, assertRequestQuery } from '../../util/api-utils';
import { BadRequestError, NotFoundError } from '../../util/error-types';
import {
  buildMusterWindow,
  getEarliestMusterWindowTime,
  getNearestMusterWindow,
  getOneTimeMusterWindowTime,
  individualMusterComplianceByDateRange,
  MusterCompliance, musterComplianceStatsByDateRange,
  MusterWindow,
} from '../../util/muster-utils';
import {
  ApiRequest,
  OrgEdipiParams,
  OrgMusterConfigurationParams,
  OrgParam,
  OrgRoleParams,
} from '../api.router';
import { Observation } from '../observation/observation.model';
import { Roster } from '../roster/roster.model';
import { ChangeType, RosterHistory } from '../roster/roster-history.model';
import { ReportSchema } from '../report-schema/report-schema.model';
import { MusterConfiguration } from './muster-config.model';
import { SavedFilter } from '../saved-filter/saved-filter.model';
import { MusterFilter } from './muster-filter.model';
import { Org } from '../org/org.model';
import { EntityService } from '../../util/entity-utils';


class MusterController {

  async getMusterConfigurations(req: ApiRequest<OrgParam>, res: Response) {
    const musterConfigs = await MusterConfiguration.find({
      relations: ['reportSchema', 'filters', 'filters.filter'],
      where: {
        org: req.appOrg!.id,
      },
      order: {
        id: 'ASC',
      },
    });

    res.json(musterConfigs);
  }

  async addMusterConfiguration(req: ApiRequest<OrgParam, AddMusterConfigurationBody>, res: Response) {
    const musterConfig = new MusterConfiguration();
    musterConfig.org = req.appOrg!;
    musterConfig.filters = [];
    const newMusterConfig = await upsertMusterConfiguration(
      req.appOrg!,
      assertRequestBody(req, [
        'days',
        'reportId',
        'startTime',
        'timezone',
        'durationMinutes',
        'filters',
      ]),
      musterConfig,
    );

    res.status(201).json(newMusterConfig);
  }

  async updateMusterConfiguration(req: ApiRequest<OrgMusterConfigurationParams, UpdateMusterConfigurationBody>, res: Response) {
    const existingMusterConfig = await MusterConfiguration.findOne({
      relations: ['reportSchema', 'filters', 'filters.filter'],
      where: {
        org: req.appOrg!.id,
        id: parseInt(req.params.musterConfigurationId),
      },
    });
    if (!existingMusterConfig) {
      throw new NotFoundError('The muster configuration could not be found.');
    }
    existingMusterConfig.org = req.appOrg!;

    const updatedMusterConfig = await upsertMusterConfiguration(
      req.appOrg!,
      assertRequestBody(req, [
        'days',
        'reportId',
        'startTime',
        'timezone',
        'durationMinutes',
        'filters',
      ]),
      existingMusterConfig,
    );

    res.json(updatedMusterConfig);
  }

  async deleteMusterConfiguration(req: ApiRequest<OrgMusterConfigurationParams>, res: Response) {
    const existingMusterConfig = await MusterConfiguration.findOne({
      relations: ['reportSchema', 'filters', 'filters.filter'],
      where: {
        org: req.appOrg!.id,
        id: parseInt(req.params.musterConfigurationId),
      },
    });
    if (!existingMusterConfig) {
      throw new NotFoundError('The muster configuration could not be found.');
    }

    const deletedMusterConfig = await existingMusterConfig.remove();
    res.json(deletedMusterConfig);
  }

  async getWeeklyMusterTrends(req: ApiRequest<null, null, GetWeeklyMusterTrendsQuery>, res: Response) {
    assertRequestQuery(req, [
      'weeksCount',
    ]);

    const currentDate = moment().endOf('day');
    const weeksCount = parseInt(req.query.weeksCount ?? '6');

    const weeklyTrends: { onTime: number; total: number }[] = [];
    for (let i = 0; i < weeksCount; i++) {
      weeklyTrends.push({
        onTime: 0,
        total: 0,
      });
    }

    const startDate = currentDate.clone().subtract(weeksCount, 'weeks');
    const complianceStats = await musterComplianceStatsByDateRange(req.appOrg!, req.appUserRole!, undefined, undefined, startDate.valueOf(), currentDate.valueOf());
    for (const unitCompliance of complianceStats) {
      const week = Math.floor(moment(unitCompliance.isoDate).diff(startDate, 'week'));
      if (week >= 0 && week < weeklyTrends.length) {
        weeklyTrends[week].onTime += unitCompliance.onTime;
        weeklyTrends[week].total += unitCompliance.total;
      }
    }

    res.json({
      weekly: weeklyTrends,
    });
  }

  /**
   * Close any muster windows that ended in the provided date range.  Any individuals that did not report for the window
   * will be flagged as 'non_reporting'.
   *
   * @param req
   * @param res
   */
  async closeMusterWindows(req: ApiRequest<null, null, CloseMusterWindowsQuery>, res: Response) {
    const since = parseInt(req.query.since);
    const until = parseInt(req.query.until);

    // Get all muster configurations
    const musterConfig = await MusterConfiguration.find({
      relations: ['reportSchema', 'org', 'filters', 'filters.filter'],
    });

    const musterWindows: MusterWindow[] = [];

    for (const muster of musterConfig) {
      const durationMilliseconds = muster.durationMinutes * 60 * 1000;

      if (!muster.days) {
        // This is a one-time muster configuration so we just need to see if
        // the single expiration is in the range.
        const current = getOneTimeMusterWindowTime(muster);
        const end = current + durationMilliseconds;

        if (end > since && end <= until) {
          musterWindows.push(buildMusterWindow(current, end, muster, muster.org!));
        }
      } else {
        // Get the unix timestamp of the earliest possible muster window, it could be in the previous week if the
        // muster window spans the week boundary.
        // Loop through each week
        let current = getEarliestMusterWindowTime(muster, since - durationMilliseconds);
        while (current < until) {
          // Loop through each day of week to see if any of the windows ended in the query window
          for (let day = DaysOfTheWeek.Sunday; day <= DaysOfTheWeek.Saturday && current < until; day = nextDay(day)) {
            const end = current + durationMilliseconds;
            // If the window ended in the query window, add it to the list
            if (end > since && end <= until && dayIsIn(day, muster.days)) {
              musterWindows.push(buildMusterWindow(current, end, muster, muster.org!));
            }
            current += oneDayMilliseconds;
          }
        }
      }
    }
    const service = new EntityService(RosterHistory);
    for (const window of musterWindows) {
      const org = window.configuration.org!;
      const columns = await Roster.getColumns(org);
      const timestamp = window.endTimestamp / 1000;
      const queryBuilder = getConnection()
        .createQueryBuilder()
        .select('roster.edipi')
        .addSelect(`to_timestamp(${timestamp})`)
        .addSelect(org.reportingGroup ? `'${org.reportingGroup}'` : 'NULL')
        .addSelect(`'${window.configuration.reportSchema!.id}'`)
        .addSelect(`${org.id}`)
        .addSelect(`'${window.id}'`)
        .addSelect(`'${MusterStatus.NON_REPORTING}'`)
        .addSelect(`${window.configuration.id}`)
        .addSelect('roster.id')
        .from(qb => {
          return qb.select()
            .distinctOn(['rh.edipi'])
            .addSelect('rh.*')
            .from(RosterHistory, 'rh')
            .where(`rh.timestamp <= to_timestamp(${timestamp})`)
            .orderBy('rh.edipi')
            .addOrderBy('rh.timestamp', 'DESC');
        }, 'roster')
        .leftJoin(Observation, 'o', `o.roster_history_entry_id = roster.id AND o.muster_window_id = '${window.id}'`)
        .where('o.id IS NULL')
        .andWhere(`roster.change_type <> '${ChangeType.Deleted}'`) as SelectQueryBuilder<RosterHistory>;

      const allParams: any[] = [];
      if (window.configuration.filters && window.configuration.filters.length > 0) {
        const filterQueries: string[] = [];
        let paramIndex = 1;
        for (const filter of window.configuration.filters!) {
          const filterQb = RosterHistory.createQueryBuilder().select();
          Object.keys(filter.filter.config).forEach(columnName => {
            const column = findColumnByFullyQualifiedName(columnName, columns);
            if (!column) {
              throw new Error(`Column "${columnName}" was not found`);
            }
            service.applyWhere(filterQb, column, filter.filter.config[columnName]);
          });
          const [fullFilterQuery, filterParams] = filterQb.getQueryAndParameters();
          let filterQuery = fullFilterQuery.substring(fullFilterQuery.indexOf('WHERE') + 6);
          for (let i = 0; i < filterParams.length; i++) {
            filterQuery = filterQuery.replace(new RegExp(`\\$\\b${i + 1}\\b`, 'g'), `$${paramIndex}`);
            paramIndex += 1;
          }
          filterQueries.push(filterQuery);
          allParams.push(...filterParams);
        }
        queryBuilder.andWhere(`(${filterQueries.map(filter => `(${filter})`).join(' OR ')})`);
      }

      const selectQuery = queryBuilder.getQuery();

      await getConnection().query(`
      INSERT INTO observation(edipi, timestamp, reporting_group, report_schema_id, report_schema_org,
                              muster_window_id, muster_status, muster_configuration_id, roster_history_entry_id)
      ${selectQuery}
      `, allParams);
    }
    res.json(musterWindows);
  }

  async getNearestMusterWindow(req: ApiRequest<OrgEdipiParams, null, GetNearestMusterWindowQuery>, res: Response) {
    const timestamp = parseInt(req.query.timestamp);
    const nearestMusterWindow = await getNearestMusterWindow(req.appOrg!, req.params.edipi, timestamp, req.query.reportId);
    if (nearestMusterWindow == null) {
      throw new NotFoundError('No muster window could be found for the given EDIPI.');
    }

    res.json(nearestMusterWindow);
  }

  /**
   * Provides Muster Compliance details for all service members for the given unit id(s) curent roster
   */
  async getRosterMusterComplianceByDateRange(req: ApiRequest<OrgRoleParams, null, GetMusterRosterQuery>, res: Response<Paginated<Partial<MusterCompliance>>>) {
    assertRequestQuery(req, ['fromDate', 'toDate', 'reportId', 'limit', 'page']);

    /* Dates come in UTC timezone.
      For example the date 2021-07-04 11:59 PM selected in a browser
                  comes as 2021-07-05T04:59:00.000Z */
    const fromDate = moment(req.query.fromDate);
    const toDate = moment(req.query.toDate);

    if (!fromDate.isValid() || !toDate.isValid() || fromDate > toDate) {
      throw new BadRequestError('Invalid ISO date range.');
    }

    const rowLimit = parseInt(req.query.limit);
    const pageNumber = parseInt(req.query.page);
    // When filter id is missing, then data for the full roster is requested in getRosterMusterComplianceCalcByDateRange()
    const filterId = (req.query.filterId != null) ? parseInt(req.query.filterId) : undefined;
    const reportId = req.query.reportId;

    const complianceRecords = await individualMusterComplianceByDateRange(req.appOrg!, req.appUserRole!, filterId, reportId, fromDate.valueOf(), toDate.valueOf(), pageNumber * rowLimit, rowLimit);
    return res.json(complianceRecords);
  }

  /**
   * This method returns the normalized rate (0 - 1.0) of compliance on a given
   * date range for all units that match a given filter for the given report type.
   */
  async getMusterComplianceStatsByDateRange(
    req: ApiRequest<{ orgId: number; filterId: number }, null, GetMusterComplianceByDateRangeQuery>,
    res: Response<GetMusterComplianceByDateRangeResponse>,
  ) {
    assertRequestQuery(req, ['fromDate', 'toDate', 'reportId']);
    const fromDate = moment(req.query.fromDate);
    const toDate = moment(req.query.toDate);

    if (!fromDate.isValid() || !toDate.isValid() || fromDate > toDate) {
      throw new BadRequestError('Invalid ISO date range.');
    }

    const filterId = (req.query.filterId != null) ? parseInt(req.query.filterId) : undefined;
    const reportId = req.query.reportId;

    const complianceStats = await musterComplianceStatsByDateRange(req.appOrg!, req.appUserRole!, filterId, reportId, fromDate.valueOf(), toDate.valueOf());
    res.json({
      musterComplianceRates: complianceStats,
    });
  }

}

async function upsertMusterConfiguration(org: Org, data: MusterConfigurationData, musterConfiguration: MusterConfiguration) {
  let updatedMusterConfig: MusterConfiguration | null = null;
  await getManager().transaction(async manager => {
    const reportSchema = await ReportSchema.findOne({
      where: {
        org: org.id,
        id: data.reportId,
      },
    });

    if (!reportSchema) {
      throw new NotFoundError('A report schema with the given report ID could not be found.');
    }

    reportSchema.org = org;

    const savedFilters: MusterFilter[] = [];
    for (const musterFilter of musterConfiguration.filters!) {
      if (!data.filters.find(f => f.id === musterFilter.filter.id)) {
        await manager.remove(musterFilter);
      }
    }
    for (const filter of data.filters) {
      let musterFilter = musterConfiguration.filters!.find(f => f.filter.id === filter.id);
      if (!musterFilter) {
        const savedFilter = await SavedFilter.findOne({
          where: {
            org: org.id,
            id: filter.id,
          },
        });
        if (!savedFilter) {
          throw new NotFoundError(`A saved filter with ID ${filter.id} could not be found.`);
        }
        musterFilter = new MusterFilter();
        musterFilter.filter = savedFilter;
      }
      musterFilter.filterParams = filter.params;
      savedFilters.push(musterFilter);
    }

    musterConfiguration.days = data.days;
    musterConfiguration.reportSchema = reportSchema;
    musterConfiguration.startTime = data.startTime;
    musterConfiguration.timezone = data.timezone;
    musterConfiguration.durationMinutes = data.durationMinutes;
    // HACK: TypeORM seems to be trying to cascade update these filters which causes an error.  The workaround is to
    // delete them from the object prior to save and then manually save them after.
    // See https://github.com/typeorm/typeorm/issues/2859
    delete musterConfiguration.filters;
    updatedMusterConfig = await manager.save(musterConfiguration);
    for (const filter of savedFilters) {
      filter.musterConfig = updatedMusterConfig;
      await manager.save(filter);
    }
  });
  return updatedMusterConfig;
}

export default new MusterController();
