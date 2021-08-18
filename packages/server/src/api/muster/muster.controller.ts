import { Response } from 'express';
import { Brackets, In } from 'typeorm';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  getDayBitFromMomentDay,
  GetMusterComplianceByDateRangeQuery,
  GetClosedMusterWindowsQuery,
  GetMusterRosterQuery,
  GetMusterUnitTrendsQuery,
  GetNearestMusterWindowQuery,
  GetMusterComplianceByDateRangeResponse,
  MusterConfiguration,
  Paginated,
} from '@covid19-reports/shared';
import { assertRequestQuery } from '../../util/api-utils';
import {
  BadRequestError,
  NotFoundError,
} from '../../util/error-types';
import {
  buildMusterWindow,
  calcMusterPercent,
  getDistanceToWindow,
  getEarliestMusterWindowTime,
  getMusterRosterStats,
  getMusterUnitTrends,
  getOneTimeMusterWindowTime,
  MusterWindow,
  getCompliantUserObserverationCount,
  getUnitRequiredMusterCount,
  MusterCompliance,
} from '../../util/muster-utils';
import {
  dateFromString,
  dayIsIn,
  DaysOfTheWeek,
  nextDay,
  oneDaySeconds,
} from '../../util/util';
import {
  ApiRequest,
  OrgRoleParams,
  OrgUnitParams,
} from '../api.router';
import { Observation } from '../observation/observation.model';
import { Roster } from '../roster/roster.model';
import {
  ChangeType,
  RosterHistory,
} from '../roster/roster-history.model';
import { ReportSchema } from '../report-schema/report-schema.model';
import { Unit } from '../unit/unit.model';


class MusterController {

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
    // Get all units with muster configurations
    const unitsWithMusterConfigs = await Unit
      .createQueryBuilder('unit')
      .leftJoinAndSelect('unit.org', 'org')
      .where('json_array_length(unit.muster_configuration) > 0')
      .orWhere(new Brackets(sqb => {
        sqb.where('unit.include_default_config');
        sqb.andWhere('json_array_length(org.default_muster_configuration) > 0');
      }))
      .getMany();

    const musterWindows: MusterWindow[] = [];

    for (const unit of unitsWithMusterConfigs) {
      const musterConfig = unit.combinedConfiguration();
      for (const muster of musterConfig) {
        const durationSeconds = muster.durationMinutes * 60;

        if (!muster.days) {
          // This is a one-time muster configuration so we just need to see if
          // the single expiration is in the range.
          const current = getOneTimeMusterWindowTime(muster);
          const end = current + durationSeconds;

          if (end > since && end <= until) {
            musterWindows.push(buildMusterWindow(unit, current, end, muster));
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
                musterWindows.push(buildMusterWindow(unit, current, end, muster));
              }
              current += oneDaySeconds;
            }
          }
        }
      }
    }
    res.json(musterWindows);
  }

  async getNearestMusterWindow(req: ApiRequest<OrgUnitParams, null, GetNearestMusterWindowQuery>, res: Response) {
    const timestamp = parseInt(req.query.timestamp);

    const unit = await Unit.findOne({
      relations: ['org'],
      where: {
        id: req.params.unitId,
        org: req.appOrg!.id,
      },
    });

    if (!unit) {
      throw new NotFoundError('The unit could not be found.');
    }

    const musterConfig = unit.combinedConfiguration();
    let minDistance: number | null = null;
    let closestMuster: MusterConfiguration | undefined;
    let closestStart = 0;
    let closestEnd = 0;

    for (const muster of musterConfig) {
      if (muster.reportId !== req.query.reportId) {
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

    res.json(closestMuster ? buildMusterWindow(unit, closestStart, closestEnd, closestMuster) : null);
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
    // When unit id is missing, then data for all units are requested
    const unitId = (req.query.unitId != null) ? parseInt(req.query.unitId) : undefined;
    const orgId = req.appOrg!.id;


    // get units for the org
    const orgUnits = await Unit.find({
      where: { org: orgId },
    });

    // get unit information for the org
    const unitIds: number[] = [];
    const unitNames: string[] = [];
    const configsByUnitId: Map<number, MusterConfiguration[]> = new Map<number, MusterConfiguration[]>();

    orgUnits.forEach(unit => {
      if (!unitId || unitId === unit.id) {
        unitIds.push(unit.id);
        unitNames.push(unit.name);
        configsByUnitId.set(unit.id, unit.musterConfiguration);
      }
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

    return res.json({
      rows: toRosterCompliancePageWithRowLimit(complianceRecords, pageNumber, rowLimit),
      totalRowsCount: complianceRecords.length,
    });
  }

  /**
   * This method returns the normalized rate (0 - 1.0) of compliance on a given
   * date range for a given unit, against all of the unit's muster configs.
   */
  async getUnitMusterComplianceByDateRange(
    req: ApiRequest<{ orgId: number; unitName: string }, null, GetMusterComplianceByDateRangeQuery>,
    res: Response<GetMusterComplianceByDateRangeResponse>,
  ) {
    const out: GetMusterComplianceByDateRangeResponse = { musterComplianceRates: [] };
    let fromDate: moment.Moment = moment(req.query.isoStartDate, 'YYYY-MM-DD');
    const toDate: moment.Moment = moment(req.query.isoEndDate, 'YYYY-MM-DD');

    if (!fromDate.isValid() || !toDate.isValid() || fromDate > toDate) {
      throw new BadRequestError('Invalid ISO date range.');
    } else {
      while (fromDate <= toDate) {
        const compliance = await getMusterComplianceByDate(req.params.orgId, req.params.unitName, fromDate.toISOString());
        out.musterComplianceRates.push({ musterComplianceRate: compliance, isoDate: fromDate.toISOString() });
        fromDate = fromDate.add(1, 'day');
      }
    }
    res.json(out);
  }

}

function toRosterCompliancePageWithRowLimit(musterInfo: MusterCompliance[], page: number, limit: number): MusterCompliance[] {
  const offset = page * limit;
  return musterInfo.slice(offset, offset + limit);
}

/**
 * This helper method returns the normalized rate (0 - 1.0) of compliance on a given
 * date for a given unit, against all of the unit's muster configs.
 * @param orgId - the organization id
 * @param unitName - the roster the users belong to
 * @param isoDate - the date in format YYYY-MM-DD
 */
async function getMusterComplianceByDate(orgId: number, unitName: string, isoDate: string) {
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

    const usersOnRoster = await getUsersOnRosterByDate(orgId, unitName, isoDate);
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
          const observationCount: number = await getObservationComplianceCount(orgId, unitName, users, musterConfig.reportId, musterStart, musterEnd);
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
          const observationCount: number = await getObservationComplianceCount(orgId, unitName, users, musterConfig.reportId, musterStart, musterEnd);
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
 * @param unitName - the roster the users belong to
 * @param edipis - the users that are on roster
 * @param reportId - the report schema to find observations for
 * @param musterStart - the start of the muster window the observations must fall within
 * @param musterEnd - the end of the muster window the observations must fall within
 */
async function getObservationComplianceCount(orgId: number, unitName: string, edipis: string[], reportId: string, musterStart: moment.Moment, musterEnd: moment.Moment) {
  const observationCount = await Observation.createQueryBuilder('observation')
    .select()
    .where(`observation.edipi in (:...edipis)`, { edipis })
    .andWhere(`observation.unit = :unit`, { unit: unitName })
    .andWhere(`observation.report_schema_id = :reportId`, { reportId })
    .andWhere(`observation.report_schema_org = :orgId`, { orgId })
    .andWhere(`observation.timestamp between :musterStart and :musterEnd`, { musterStart, musterEnd })
    .orderBy('observation.edipi', 'DESC')
    .getCount();
  return observationCount;
}

/**
 * This "helper" method returns the list of unique users on roster on the specified date/time
 * @param orgId - the organization id
 * @param unitName - the roster the users belong to
 * @param date - the date to get the list of users on roster
 */
async function getUsersOnRosterByDate(orgId: number, unitName: string, date: string) {
  const reportDate = dateFromString(date);
  if (!reportDate) {
    throw new BadRequestError('Missing reportDate.');
  }
  const timestamp = reportDate.getTime() / 1000;
  const rows = await RosterHistory.createQueryBuilder('roster')
    .leftJoinAndSelect('roster.unit', 'unit')
    .select('DISTINCT ON(roster.edipi) roster.edipi, roster.change_type, unit.muster_configuration')
    .where(`roster.timestamp <= to_timestamp(:timestamp) AT TIME ZONE '+0'`, { timestamp })
    .andWhere('unit.name = :unitName', { unitName })
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
    const out = {
      org: orgId,
      users: onRoster,
      musterConfig: rows[0].muster_configuration,
    };
    return out;
  }
  return {
    org: null,
    users: [],
    musterConfig: [],
  };
}
export default new MusterController();
