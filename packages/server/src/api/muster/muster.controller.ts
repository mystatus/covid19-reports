import { Response } from 'express';
import { getConnection, getManager, In, SelectQueryBuilder } from 'typeorm';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  AddMusterConfigurationBody,
  ColumnInfo,
  GetClosedMusterWindowsQuery,
  getDayBitFromMomentDay,
  GetMusterComplianceByDateRangeQuery,
  GetMusterComplianceByDateRangeResponse,
  GetMusterRosterQuery,
  GetMusterUnitTrendsQuery,
  GetNearestMusterWindowQuery, MusterConfigurationData,
  Paginated, UpdateMusterConfigurationBody,
} from '@covid19-reports/shared';
import { assertRequestBody, assertRequestQuery } from '../../util/api-utils';
import { BadRequestError, NotFoundError } from '../../util/error-types';
import {
  buildMusterWindow,
  calcMusterPercent,
  getCompliantUserObserverationCount,
  getDistanceToWindow,
  getEarliestMusterWindowTime,
  getMusterRosterStats,
  getMusterUnitTrends,
  getOneTimeMusterWindowTime,
  getUnitRequiredMusterCount,
  MusterCompliance,
  MusterWindow,
} from '../../util/muster-utils';
import { dateFromString, dayIsIn, DaysOfTheWeek, nextDay, oneDaySeconds } from '../../util/util';
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
import { Unit } from '../unit/unit.model';
import { MusterConfiguration } from './muster-config.model';
import { SavedFilter } from '../saved-filter/saved-filter.model';
import { EntityService, findColumnByName } from '../../util/entity-utils';
import { MusterFilter } from './muster-filter.model';
import { Org } from '../org/org.model';


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

  async getMusterRoster(req: ApiRequest<OrgRoleParams, null, GetMusterRosterQuery>, res: Response<Paginated<Partial<Roster>>>) {
    assertRequestQuery(req, [
      'fromDate',
      'toDate',
      'limit',
      'page',
    ]);

    const fromDate = moment(req.query.fromDate);
    const toDate = moment(req.query.toDate);
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const unitId = (req.query.unitId != null) ? parseInt(req.query.unitId) : undefined;

    const rosterStats = await getMusterRosterStats({
      org: req.appOrg!,
      userRole: req.appUserRole!,
      unitId,
      fromDate,
      toDate,
    });

    const offset = page * limit;

    return res.json({
      rows: rosterStats.slice(offset, offset + limit),
      totalRowsCount: rosterStats.length,
    });
  }

  async getMusterUnitTrends(req: ApiRequest<null, null, GetMusterUnitTrendsQuery>, res: Response) {
    assertRequestQuery(req, [
      'currentDate',
      'weeksCount',
      'monthsCount',
    ]);

    const currentDate = moment(req.query.currentDate);
    const weeksCount = parseInt(req.query.weeksCount ?? '6');
    const monthsCount = parseInt(req.query.monthsCount ?? '6');

    const unitTrends = await getMusterUnitTrends({
      userRole: req.appUserRole!,
      currentDate,
      weeksCount,
      monthsCount,
    });

    res.json(unitTrends);
  }

  async getClosedMusterWindows(req: ApiRequest<null, null, GetClosedMusterWindowsQuery>, res: Response) {
    const since = parseInt(req.query.since);
    const until = parseInt(req.query.until);

    // Get all muster configurations
    const musterConfig = await MusterConfiguration
      .createQueryBuilder('muster')
      .leftJoinAndSelect('muster.reportSchema', 'reportSchema')
      .leftJoinAndSelect('muster.org', 'org')
      .getMany();

    const musterWindows: MusterWindow[] = [];

    for (const muster of musterConfig) {
      const durationSeconds = muster.durationMinutes * 60;

      if (!muster.days) {
        // This is a one-time muster configuration so we just need to see if
        // the single expiration is in the range.
        const current = getOneTimeMusterWindowTime(muster);
        const end = current + durationSeconds;

        if (end > since && end <= until) {
          musterWindows.push(buildMusterWindow(current, end, muster, muster.org!));
        }
      } else {
        // Get the unix timestamp of the earliest possible muster window, it could be in the previous week if the
        // muster window spans the week boundary.
        // Loop through each week
        let current = getEarliestMusterWindowTime(muster, since - durationSeconds);
        while (current < until) {
          // Loop through each day of week to see if any of the windows ended in the query window
          for (let day = DaysOfTheWeek.Sunday; day <= DaysOfTheWeek.Saturday && current < until; day = nextDay(day)) {
            const end = current + durationSeconds;
            // If the window ended in the query window, add it to the list
            if (end > since && end <= until && dayIsIn(day, muster.days)) {
              musterWindows.push(buildMusterWindow(current, end, muster, muster.org!));
            }
            current += oneDaySeconds;
          }
        }
      }
    }
    res.json(musterWindows);
  }

  async getNearestMusterWindow(req: ApiRequest<OrgEdipiParams, null, GetNearestMusterWindowQuery>, res: Response) {
    const timestamp = parseInt(req.query.timestamp);

    const columns = await Roster.getColumns(req.appOrg!);

    const musterConfig = (await MusterConfiguration
      .createQueryBuilder('muster')
      .leftJoinAndSelect('muster.reportSchema', 'reportSchema')
      .leftJoinAndSelect('muster.filters', 'filters')
      .where('muster.org_id = :orgId', { orgId: req.appOrg!.id })
      .andWhere('muster.report_schema_id = :reportId', { reportId: req.query.reportId })
      .getMany());

    let minDistance: number | null = null;
    let closestMuster: MusterConfiguration | undefined;
    let closestStart = 0;
    let closestEnd = 0;

    for (const muster of musterConfig) {
      if (!(await rosterInMusterGroup(req.appOrg!.id, muster, columns, req.params.edipi, timestamp))) {
        continue;
      }
      const durationSeconds = muster.durationMinutes * 60;

      if (muster.days) {
        // Get the unix timestamp of the earliest possible muster window in the week of the timestamp
        let current = getEarliestMusterWindowTime(muster, timestamp);
        // Loop through each day of the week
        let firstWindowStart: number = 0;
        let lastWindowStart: number = 0;
        for (let day = DaysOfTheWeek.Sunday; day <= DaysOfTheWeek.Saturday; day = nextDay(day)) {
          const end = current + durationSeconds;
          if (dayIsIn(day, muster.days)) {
            if (firstWindowStart === 0) {
              firstWindowStart = current;
            }
            lastWindowStart = current;
            const distanceToWindow = getDistanceToWindow(current, end, timestamp);
            // Pick the closest window, if one window ends and another starts on the same second as the timestamp, prefer
            // the window that is starting
            if (minDistance == null || timestamp === current || Math.abs(minDistance) > Math.abs(distanceToWindow)) {
              minDistance = distanceToWindow;
              closestMuster = muster;
              closestStart = current;
              closestEnd = end;
            }
          }
          current += oneDaySeconds;
        }
        if (firstWindowStart > timestamp || lastWindowStart! + durationSeconds < timestamp) {
          // If the timestamp is before the first window or after the last window, we need to compare with the
          // nearest window in the adjacent week
          const windowStart = firstWindowStart > timestamp ? lastWindowStart - oneDaySeconds * 7 : firstWindowStart + oneDaySeconds * 7;
          const windowEnd = windowStart + durationSeconds;
          const distanceToWindow = getDistanceToWindow(windowStart, windowEnd, timestamp);
          if (Math.abs(minDistance!) > Math.abs(distanceToWindow)) {
            closestMuster = muster;
            closestStart = windowStart;
            closestEnd = windowEnd;
          }
        }
      } else {
        const start = getOneTimeMusterWindowTime(muster);
        const end = start + durationSeconds;
        const distanceToWindow = getDistanceToWindow(start, end, timestamp);
        if (minDistance === null || Math.abs(minDistance) > Math.abs(distanceToWindow)) {
          closestMuster = muster;
          closestStart = start;
          closestEnd = end;
        }
      }
    }

    if (closestMuster == null) {
      throw new NotFoundError('No muster window could be found for the given EDIPI.');
    }

    res.json(closestMuster ? buildMusterWindow(closestStart, closestEnd, closestMuster, req.appOrg!) : null);
  }

  /**
   * Provides Muster Compliance details for all service members for the given unit id(s) curent roster
   */
  async getRosterMusterComplianceByDateRange(req: ApiRequest<OrgRoleParams, null, GetMusterRosterQuery>, res: Response<Paginated<Partial<MusterCompliance>>>) {
    assertRequestQuery(req, ['fromDate', 'toDate', 'limit', 'page']);

    /* Dates come in UTC timezone.
      For example the date 2021-07-04 11:59 PM selected in a browser
                  comes as 2021-07-05T04:59:00.000Z */
    const fromDate: moment.Moment = moment(req.query.fromDate, 'YYYY-MM-DD');
    const toDate: moment.Moment = moment(req.query.toDate, 'YYYY-MM-DD');

    if (!fromDate.isValid() || !toDate.isValid() || fromDate > toDate) {
      throw new BadRequestError('Invalid ISO date range.');
    }

    const rowLimit = parseInt(req.query.limit);
    const pageNumber = parseInt(req.query.page);
    // When unit id is missing, then data for all units are requested in getRosterMusterComplianceCalcByDateRange()
    const unitId = (req.query.unitId != null) ? parseInt(req.query.unitId) : undefined;
    const orgId = req.appOrg!.id;

    const complianceRecords = await getRosterMusterComplianceRecordsByDateRange(orgId, unitId, fromDate, toDate);
    return res.json({
      rows: toRosterCompliancePageWithRowLimit(complianceRecords, pageNumber, rowLimit),
      totalRowsCount: complianceRecords.length,
    });
  }

  /**
   * This method returns the normalized rate (0 - 1.0) of compliance on a given
   * date range for a given unit, against all of the unit's muster configs.
   */
  async getFilterMusterComplianceByDateRange(
    req: ApiRequest<{ orgId: number; filterId: number }, null, GetMusterComplianceByDateRangeQuery>,
    res: Response<GetMusterComplianceByDateRangeResponse>,
  ) {
    const out: GetMusterComplianceByDateRangeResponse = { musterComplianceRates: [] };
    let fromDate: moment.Moment = moment(req.query.isoStartDate, 'YYYY-MM-DD');
    const toDate: moment.Moment = moment(req.query.isoEndDate, 'YYYY-MM-DD');

    if (!fromDate.isValid() || !toDate.isValid() || fromDate > toDate) {
      throw new BadRequestError('Invalid ISO date range.');
    } else {
      while (fromDate <= toDate) {
        const compliance = await getMusterComplianceByDate(req.params.orgId, req.params.filterId, fromDate.toISOString());
        out.musterComplianceRates.push({ musterComplianceRate: compliance, isoDate: fromDate.toISOString() });
        fromDate = fromDate.add(1, 'day');
      }
    }
    res.json(out);
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

async function rosterInMusterGroup(orgId: number, muster: MusterConfiguration, columns: ColumnInfo[], edipi: string, timestamp: number) {
  if (muster.filters == null || muster.filters.length === 0) {
    // Just see if the edipi was in the roster at the time
    return await filterMatchesRoster(null, columns, orgId, edipi, timestamp);
  }
  for (const filter of muster.filters) {
    if (await filterMatchesRoster(filter.filter, columns, orgId, edipi, timestamp)) {
      return true;
    }
  }
  return false;
}

async function filterMatchesRoster(filter: SavedFilter | null, columns: ColumnInfo[], orgId: number, edipi: string, timestamp: number) {
  const service = new EntityService(RosterHistory);
  let rosterQuery = getConnection()
    .createQueryBuilder()
    .select('roster.*')
    .from(q => {
      return q
        .select('roster_history.*')
        .addSelect('roster_history.unit_id', 'unit')
        .distinctOn(['roster_history.unit_id'])
        .from(RosterHistory, 'roster_history')
        .leftJoinAndSelect('roster_history.unit', 'unit')
        .where('roster_history.edipi = :edipi', { edipi })
        .andWhere(`roster_history.timestamp <= to_timestamp(:timestamp) AT TIME ZONE '+0'`, { timestamp })
        .andWhere('unit.org_id = :orgId', { orgId })
        .orderBy('roster_history.unit_id')
        .addOrderBy('roster_history.timestamp', 'DESC')
        .addOrderBy('roster_history.change_type', 'DESC');
    }, 'roster')
    .where('roster.change_type <> :changeType', { changeType: ChangeType.Deleted }) as SelectQueryBuilder<RosterHistory>;
  if (filter != null) {
    Object.keys(filter.config).forEach(columnName => {
      rosterQuery = service.applyWhere(rosterQuery, findColumnByName(columnName, columns), filter.config[columnName]);
    });
  }
  return (await rosterQuery.getRawOne()) != null;
}

function toRosterCompliancePageWithRowLimit(musterInfo: MusterCompliance[], page: number, limit: number): MusterCompliance[] {
  const offset = page * limit;
  return musterInfo.slice(offset, offset + limit);
}

/**
 * This helper method returns the normalized rate (0 - 1.0) of compliance on a given
 * date for a given unit, against all of the unit's muster configs.
 * @param orgId - the organization id
 * @param filterId - the roster filter
 * @param isoDate - the date in format YYYY-MM-DD
 */
async function getMusterComplianceByDate(orgId: number, filterId: number, isoDate: string) {
  let outValue: number = 0;
  let reportDate: Date | undefined;
  try {
    reportDate = dateFromString(isoDate);
  } catch (DateParseError) {
    throw new BadRequestError('Invalid ISO date.');
  }

  if (reportDate) {
    // eslint-disable-next-line no-bitwise
    const dayBit = getDayBitFromMomentDay(reportDate.getDay());

    const usersOnRoster = await getUsersOnRosterByDate(orgId, filterId, isoDate);
    const users = usersOnRoster.users;
    const userCount = users.length;
    let musterAvg: number = 0;

    if (usersOnRoster.musterConfig.length === 0 || userCount === 0) {
      return outValue;
    }

    let numActiveConfigs: number = 0;
    for (const musterConfig of usersOnRoster.musterConfig) {
      if (musterConfig.days) {
        // handle recurring muster...
        // early out if the reportDate in question is not on a muster day.
        // eslint-disable-next-line no-bitwise
        if ((dayBit & musterConfig.days) === dayBit) {
          const musterTime = `${reportDate.toISOString().split('T')[0]} ${musterConfig.startTime}`;
          const musterStart = moment.tz(musterTime, musterConfig.timezone);
          const musterEnd = moment.tz(musterTime, musterConfig.timezone).add({ minutes: musterConfig.durationMinutes });
          const observationCount: number = await getObservationComplianceCount(orgId, users, musterConfig.reportId, musterStart, musterEnd);
          musterAvg += observationCount / userCount;
          numActiveConfigs += 1;
        }
      } else {
        // handle one-time muster
        const musterTime = musterConfig.startTime;
        const musterStart = moment.tz(musterTime, musterConfig.timezone);
        const musterEnd = moment.tz(musterTime, musterConfig.timezone).add({ minutes: musterConfig.durationMinutes });
        // early out if the query date is not on the same day as the one-time muster
        if (moment(isoDate).format('YYYY-MM-DD') === musterStart.format('YYYY-MM-DD')) {
          const observationCount: number = await getObservationComplianceCount(orgId, users, musterConfig.reportId, musterStart, musterEnd);
          musterAvg += observationCount / userCount;
          numActiveConfigs += 1;
        }
      }
    }
    outValue = musterAvg / numActiveConfigs;
  }
  return outValue;
}

/**
 * This "helper" method returns the number of observations found for a given muster config
 * @param orgId - the organization id
 * @param edipis - the users that are on roster
 * @param reportId - the report schema to find observations for
 * @param musterStart - the start of the muster window the observations must fall within
 * @param musterEnd - the end of the muster window the observations must fall within
 */
async function getObservationComplianceCount(orgId: number, edipis: string[], reportId: string, musterStart: moment.Moment, musterEnd: moment.Moment) {
  return await Observation.createQueryBuilder('observation')
    .select()
    .where(`observation.edipi in (:...edipis)`, { edipis })
    .andWhere(`observation.report_schema_id = :reportId`, { reportId })
    .andWhere(`observation.report_schema_org = :orgId`, { orgId })
    .andWhere(`observation.timestamp between :musterStart and :musterEnd`, { musterStart, musterEnd })
    .orderBy('observation.edipi', 'DESC')
    .getCount();
}

/**
 * This "helper" method returns the list of unique users on roster on the specified date/time
 * @param orgId - the organization id
 * @param filterId - the roster filter
 * @param date - the date to get the list of users on roster
 */
async function getUsersOnRosterByDate(orgId: number, filterId: number, date: string) {
  const reportDate = dateFromString(date);
  if (!reportDate) {
    throw new BadRequestError('Missing reportDate.');
  }
  const timestamp = reportDate.getTime() / 1000;
  const rows = await RosterHistory.createQueryBuilder('roster')
    .leftJoinAndSelect('roster.unit', 'unit')
    .select('DISTINCT ON(roster.edipi) roster.edipi, roster.change_type, unit.muster_configuration')
    .where(`roster.timestamp <= to_timestamp(:timestamp) AT TIME ZONE '+0'`, { timestamp })
    .andWhere('unit.org_id = :orgId', { orgId })
    .orderBy('roster.edipi', 'DESC')
    .addOrderBy(`EXTRACT (EPOCH FROM (to_timestamp(${timestamp}) at Time Zone '+0' - roster.timestamp))`, 'ASC')
    .getRawMany();
  const onRoster: string[] = [];
  if (rows.length > 0) {
    rows.forEach(entry => {
      if (entry.change_type !== ChangeType.Deleted.toString()) {
        onRoster.push(entry.edipi);
      }
    });
    return {
      org: orgId,
      users: onRoster,
      musterConfig: rows[0].muster_configuration,
    };
  }
  return {
    org: null,
    users: [],
    musterConfig: [],
  };
}

/**
 * Returns the compliance per individual for each member of the roster
 * @param orgId the organization that the observation must belong under to be compliant
 * @param unitId the units of the org to calculate the compliance for, these should all be from the same org.
 * @param fromDate the start of the date range to calc compliance for.
 * @param toDate the end of the date range to calc compliance for.
 */
export async function getRosterMusterComplianceRecordsByDateRange(
  orgId: number,
  unitId: number | undefined,
  fromDate: moment.Moment,
  toDate: moment.Moment,
) {
  // get units for the org
  const orgUnits = await Unit.find({
    where: { org: orgId },
  });
  const requestedUnits = orgUnits.filter(unit => !unitId || unitId === unit.id);

  // get unit information/structures for queries and methods below
  const unitIds: number[] = [];
  const unitNames: string[] = [];
  const configsByUnitId: Map<number, MusterConfiguration[]> = new Map<number, MusterConfiguration[]>();

  requestedUnits.forEach(unit => {
    unitIds.push(unit.id);
    unitNames.push(unit.name);
  });

  // get the roster entries based on the unit IDs for the org
  const rosterEntries = await Roster.find({
    relations: ['unit'],
    where: { unit: In(unitIds) },
  });

  // get the edipis for all roster entries
  const rosterEdipis: string[] = rosterEntries.map(rosterEntry => rosterEntry.edipi);

  // get observations for all users on roster for this org
  // we use query builder here to get the data back in a flat manner
  // rather than nested

  // get edipi, timestamp and report schema id
  type ObservationRaw = Pick<Observation, 'edipi' | 'timestamp'> & {
    report_schema_id: ReportSchema['id'];
  };
  const observations = await Observation.createQueryBuilder('observation')
    .select('observation.edipi, observation.timestamp, observation.report_schema_id')
    .andWhere(`observation.timestamp between :fromDate and :toDate`, { fromDate, toDate })
    .andWhere(`observation.edipi in (:...edipis)`, { edipis: rosterEdipis })
    .andWhere(`observation.unit in (:...unitNames)`, { unitNames })
    .andWhere(`observation.report_schema_org = :orgId`, { orgId })
    .getRawMany<ObservationRaw>();

  const observationsByEdipi = _.groupBy(observations, obs => obs.edipi);
  const complianceRecords: MusterCompliance[] = rosterEntries.map(rosterEntry => {
    const configs = configsByUnitId.get(rosterEntry.unit.id);
    const totalMustersRequired = getUnitRequiredMusterCount(configs, fromDate, toDate);
    const complianceRecord: MusterCompliance = {
      edipi: rosterEntry.edipi,
      firstName: rosterEntry.firstName,
      lastName: rosterEntry.lastName,
      unitId: rosterEntry.unit.id,
      phone: rosterEntry.phoneNumber,
      totalMusters: totalMustersRequired,
      mustersReported: 0,
      musterPercent: 100,
    };

    // get the compliant observation count for this current user/edipi
    const userObservations = observationsByEdipi[rosterEntry.edipi];
    complianceRecord.mustersReported = getCompliantUserObserverationCount(userObservations, configs);

    // only perform percentage calculation if there are required musters,
    // otherwise we default to 100% compliance.
    if (complianceRecord.totalMusters > 0) {
      complianceRecord.musterPercent = calcMusterPercent(complianceRecord.totalMusters, complianceRecord.mustersReported);
    }
    return complianceRecord;
  });
  return complianceRecords;
}
export default new MusterController();
