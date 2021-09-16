// @ts-ignore
import moment from 'moment-timezone';
import {
  ColumnInfo, dayIsIn, DaysOfTheWeek, MusterComplianceByDate,
  nextDay, oneDayMilliseconds,
} from '@covid19-reports/shared';
import { getConnection, SelectQueryBuilder } from 'typeorm';
import { Org } from '../api/org/org.model';
import { MusterConfiguration } from '../api/muster/muster-config.model';
import { RosterEntry } from './roster-utils';
import { SavedFilter } from '../api/saved-filter/saved-filter.model';
import { EntityService, findColumnByName } from './entity-utils';
import { ChangeType, RosterHistory } from '../api/roster/roster-history.model';
import { Unit } from '../api/unit/unit.model';
import { Observation } from '../api/observation/observation.model';

/**
 * Returns the compliance per individual for each member of the roster
 * @param org the organization that the observation must belong under to be compliant
 * @param role the role of the user issuing the request
 * @param filterId the filter of the org to calculate the compliance for.
 * @param reportId the report to calculate compliance for.
 * @param from the start of the date range to calc compliance for in epoch milliseconds.
 * @param to the end of the date range to calc compliance for in epoch milliseconds.
 * @param offset the number of rows to skip from the results (for paging)
 * @param limit the number of rows to return (for paging)
 */
export async function individualMusterComplianceByDateRange(
  org: Org,
  role: UserRole,
  filterId: number | undefined,
  reportId: string,
  from: number,
  to: number,
  offset?: number,
  limit?: number,
) {
  const columns = await Roster.getColumns(org);
  let filter: SavedFilter | undefined;
  if (filterId != null) {
    filter = await SavedFilter.findOne({
      where: {
        id: filterId,
      },
    });
  }
  let units: Unit[] | undefined;
  if (!role.allUnits) {
    units = await role.getUnits();
  }
  const query = getConnection()
    .createQueryBuilder()
    .select('roster.edipi', 'edipi')
    .addSelect('roster.first_name', 'first_name')
    .addSelect('roster.last_name', 'last_name')
    .addSelect(`observation.custom_columns ->> 'PhoneNumber'`, 'obs_phone_number')
    .addSelect('roster.phone_number', 'roster_phone_number')
    .addSelect('roster.unit_id', 'unit_id')
    .addSelect('muster.on_time', 'on_time')
    // If we ever want to show early/late totals in the UI, we can put these back in
    // .addSelect('muster.early', 'early')
    // .addSelect('muster.late', 'late')
    .addSelect('muster.total', 'total')
    .addSelect('(muster.on_time::float / muster.total) * 100', 'compliance')
    .from(q => buildIndividualMusterComplianceQuery(org, units, q, columns, reportId, from, to, filter, offset, limit), 'muster')
    .leftJoin(RosterHistory, 'roster', 'muster.rh_id = roster.id')
    .leftJoin(Observation, 'observation', 'muster.observation_id = observation.id');

  const count = await buildIndividualMusterComplianceQuery(org, units, getConnection().createQueryBuilder(), columns, reportId, from, to, filter).getCount();
  const muster = await query.getRawMany();
  return {
    rows: muster.map(row => {
      return {
        totalMusters: row.total,
        mustersReported: row.on_time,
        musterPercent: row.compliance,
        edipi: row.edipi,
        firstName: row.first_name,
        lastName: row.last_name,
        unitId: row.unit_id,
        phone: row.obs_phone_number ?? row.roster_phone_number,
      } as MusterCompliance;
    }),
    totalRowsCount: count,
  };
}

function buildIndividualMusterComplianceQuery(
  org: Org,
  units: Unit[] | undefined,
  query: SelectQueryBuilder<any>,
  columns: ColumnInfo[],
  reportId: string,
  from: number,
  to: number,
  filter?: SavedFilter,
  offset?: number,
  limit?: number,
) {
  const service = new EntityService(RosterHistory);
  query = query.select('o.edipi', 'edipi')
    .addSelect('MAX(roster.id)', 'rh_id')
    .addSelect('MAX(o.id)', 'observation_id')
    .addSelect(`COUNT(*) FILTER (WHERE o.muster_status = 'on_time')`, 'on_time')
    // If we ever want to show early/late totals in the UI, we can put these back in
    // .addSelect(`COUNT(*) FILTER (WHERE o.muster_status = 'early')`, 'early')
    // .addSelect(`COUNT(*) FILTER (WHERE o.muster_status = 'late')`, 'late')
    .addSelect(`COUNT(*)`, 'total')
    .from(Observation, 'o')
    .innerJoin(RosterHistory, 'roster', 'o.roster_history_entry_id = roster.id')
    .where('o.timestamp BETWEEN to_timestamp(:from) and to_timestamp(:to)', { from: from / 1000, to: to / 1000 })
    .andWhere('o.report_schema_id = :reportId', { reportId })
    .andWhere('o.report_schema_org = :orgId', { orgId: org.id })
    .groupBy('o.edipi')
    .orderBy('o.edipi') as unknown as SelectQueryBuilder<RosterHistory>;
  if (units) {
    query = query
      .andWhere(`roster.unit_id IN (${units.map(unit => unit.id).join(',')})`);
  }
  if (filter != null) {
    Object.keys(filter.config).forEach(columnName => {
      query = service.applyWhere(query, findColumnByName(columnName, columns), filter!.config[columnName]);
    });
  }
  if (offset != null) {
    query = query.offset(offset);
  }
  if (limit != null) {
    query = query.limit(limit);
  }
  return query;
}


export async function musterComplianceStatsByDateRange(
  org: Org,
  role: UserRole,
  filterId: number | undefined,
  reportId: string | undefined,
  from: number,
  to: number,
) {
  const columns = await Roster.getColumns(org);
  let filter: SavedFilter | undefined;
  if (filterId != null) {
    filter = await SavedFilter.findOne({
      where: {
        id: filterId,
      },
    });
  }
  const service = new EntityService(RosterHistory);
  let query = Observation
    .createQueryBuilder('o')
    .select('roster.unit_id', 'unit_id')
    .addSelect(`DATE_TRUNC('day', o.timestamp)`, 'muster_day')
    .addSelect(`COUNT(*) FILTER (WHERE o.muster_status = 'on_time')`, 'on_time')
    .addSelect('COUNT(*)', 'total')
    .innerJoin(RosterHistory, 'roster', 'o.roster_history_entry_id = roster.id')
    .where('o.timestamp BETWEEN to_timestamp(:from) and to_timestamp(:to)', { from: from / 1000, to: to / 1000 })
    .andWhere('o.report_schema_org = :orgId', { orgId: org.id })
    .groupBy('roster.unit_id')
    .addGroupBy('muster_day')
    .orderBy('roster.unit_id')
    .addOrderBy('muster_day') as unknown as SelectQueryBuilder<RosterHistory>;
  if (reportId) {
    query = query.andWhere('o.report_schema_id = :reportId', { reportId });
  }
  if (filter != null) {
    Object.keys(filter.config).forEach(columnName => {
      query = service.applyWhere(query, findColumnByName(columnName, columns), filter!.config[columnName]);
    });
  }
  if (!role.allUnits) {
    query = query
      .andWhere(`roster.unit_id IN (${(await role.getUnits()).map(unit => unit.id).join(',')})`);
  }
  return (await query.getRawMany()).map(row => {
    const onTime = parseInt(row.on_time);
    const total = parseInt(row.total);
    return {
      unit: row.unit_id,
      isoDate: row.muster_day,
      onTime,
      total,
      compliance: onTime / total,
    } as MusterComplianceByDate;
  });
}

export function getOneTimeMusterWindowTime(muster: MusterConfiguration) {
  return moment(muster.startTime).tz(muster.timezone).valueOf();
}

export function getEarliestMusterWindowTime(muster: MusterConfiguration, referenceTime: number) {
  const musterTime = moment(muster.startTime, 'HH:mm');
  return moment(referenceTime)
    .tz(muster.timezone)
    .startOf('week')
    .add(musterTime.hour(), 'hours')
    .add(musterTime.minutes(), 'minutes')
    .valueOf();
}

export function buildMusterWindow(startTimestamp: number, endTimestamp: number, muster: MusterConfiguration, org: Org): MusterWindow {
  return {
    id: `${org.id}-${muster.id}-${moment(startTimestamp).utc().format('Y-M-D-HH-mm')}-${muster.reportSchema!.id}`,
    configuration: muster,
    orgId: org.id,
    reportingGroup: org.reportingGroup,
    startTimestamp,
    endTimestamp,
    startTime: muster.startTime,
    timezone: muster.timezone,
    durationMinutes: muster.durationMinutes,
    reportId: muster.reportSchema!.id,
  };
}

export async function getNearestMusterWindow(org: Org, edipi: string, timestamp: number, reportId: string) {
  const columns = await Roster.getColumns(org);

  const musterConfig = (await MusterConfiguration
    .createQueryBuilder('muster')
    .leftJoinAndSelect('muster.reportSchema', 'reportSchema')
    .leftJoinAndSelect('muster.filters', 'filters')
    .where('muster.org_id = :orgId', { orgId: org.id })
    .andWhere('muster.report_schema_id = :reportId', { reportId })
    .getMany());

  let minDistance: number | null = null;
  let closestMuster: MusterConfiguration | undefined;
  let closestStart = 0;
  let closestEnd = 0;

  for (const muster of musterConfig) {
    if (!(await rosterInMusterGroup(org.id, muster, columns, edipi, timestamp))) {
      continue;
    }
    const durationMilliseconds = muster.durationMinutes * 60 * 1000;

    if (muster.days) {
      // Get the unix timestamp of the earliest possible muster window in the week of the timestamp
      let current = getEarliestMusterWindowTime(muster, timestamp);
      // Loop through each day of the week
      let firstWindowStart: number = 0;
      let lastWindowStart: number = 0;
      for (let day = DaysOfTheWeek.Sunday; day <= DaysOfTheWeek.Saturday; day = nextDay(day)) {
        const end = current + durationMilliseconds;
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
        current += oneDayMilliseconds;
      }
      if (firstWindowStart > timestamp || lastWindowStart! + durationMilliseconds < timestamp) {
        // If the timestamp is before the first window or after the last window, we need to compare with the
        // nearest window in the adjacent week
        const windowStart = firstWindowStart > timestamp ? lastWindowStart - oneDayMilliseconds * 7 : firstWindowStart + oneDayMilliseconds * 7;
        const windowEnd = windowStart + durationMilliseconds;
        const distanceToWindow = getDistanceToWindow(windowStart, windowEnd, timestamp);
        if (Math.abs(minDistance!) > Math.abs(distanceToWindow)) {
          closestMuster = muster;
          closestStart = windowStart;
          closestEnd = windowEnd;
        }
      }
    } else {
      const start = getOneTimeMusterWindowTime(muster);
      const end = start + durationMilliseconds;
      const distanceToWindow = getDistanceToWindow(start, end, timestamp);
      if (minDistance === null || Math.abs(minDistance) > Math.abs(distanceToWindow)) {
        closestMuster = muster;
        closestStart = start;
        closestEnd = end;
      }
    }
  }

  return closestMuster ? buildMusterWindow(closestStart, closestEnd, closestMuster, org) : undefined;
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
        .andWhere(`roster_history.timestamp <= to_timestamp(:timestamp) AT TIME ZONE '+0'`, { timestamp: timestamp / 1000 })
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

export function getDistanceToWindow(start: number, end: number, time: number) {
  if (time > end) {
    return time - end;
  }
  if (time < start) {
    return time - start;
  }
  return 0;
}

export function getMusterWindows(org: Org, muster: MusterConfiguration, startTimestamp: number, endTimestamp: number) {
  const durationMilliseconds = muster.durationMinutes * 60 * 1000;
  const musterWindows: MusterWindow[] = [];
  if (muster.days) {
    // Get the unix timestamp of the earliest possible muster window in the week of the timestamp
    let current = getEarliestMusterWindowTime(muster, startTimestamp);
    while (current < endTimestamp) {
      // Loop through each day of the week
      for (let day = DaysOfTheWeek.Sunday; day <= DaysOfTheWeek.Saturday; day = nextDay(day)) {
        const end = current + durationMilliseconds;
        if (dayIsIn(day, muster.days) && current <= endTimestamp && end >= startTimestamp) {
          musterWindows.push(buildMusterWindow(current, end, muster, org));
        }
        current += oneDayMilliseconds;
      }
    }
  } else {
    const start = getOneTimeMusterWindowTime(muster);
    const end = start + durationMilliseconds;
    if (start <= endTimestamp && end >= startTimestamp) {
      musterWindows.push(buildMusterWindow(start, end, muster, org));
    }
  }
  return musterWindows;
}

/**
 * Represents muster compliance for an individual
 */
export type MusterCompliance = {
  totalMusters: number;
  mustersReported: number;
  musterPercent: number;
} & RosterEntry;

export interface MusterWindow {
  id: string;
  reportingGroup?: string;
  orgId: number;
  configuration: MusterConfiguration;
  startTimestamp: number;
  endTimestamp: number;
  startTime: string;
  timezone: string;
  durationMinutes: number;
  reportId: string;
}
