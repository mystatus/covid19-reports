import moment, { unitOfTime } from 'moment-timezone';
import { MSearchResponse, SearchResponse } from 'elasticsearch';
import { Response } from 'express';
import { getConnection } from 'typeorm';
import { json2csvAsync } from 'json-2-csv';
import elasticsearch from '../../elasticsearch/elasticsearch';
import { InternalServerError, NotFoundError } from '../../util/error-types';
import {
  ApiRequest, OrgParam, OrgRoleParams, OrgUnitParams, PagedQuery,
} from '../index';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { getAllowedRosterColumns } from '../roster/roster.controller';
import { Roster } from '../roster/roster.model';
import { MusterConfiguration, Unit } from '../unit/unit.model';
import {
  dayIsIn, DaysOfTheWeek, nextDay, oneDaySeconds,
} from '../../util/util';

const dateFormat = 'YYYY-MM-DD';

class MusterController {

  // TODO: Support custom muster intervals.
  async getIndividuals(req: ApiRequest<OrgRoleParams, null, GetIndividualsQuery>, res: Response) {
    const intervalCount = parseInt(req.query.intervalCount ?? '1');
    const limit = parseInt(req.query.limit ?? '10');
    const page = parseInt(req.query.page ?? '0');

    const individuals = await getIndividualsData(req.appOrg!, req.appRole!, intervalCount, req.query.unitId);

    const offset = page * limit;

    return res.json({
      rows: individuals.slice(offset, offset + limit),
      totalRowsCount: individuals.length,
    });
  }

  async exportIndividuals(req: ApiRequest<OrgParam, null, GetIndividualsQuery>, res: Response) {
    const intervalCount = parseInt(req.query.intervalCount ?? '1');

    const individuals = await getIndividualsData(req.appOrg!, req.appRole!, intervalCount, req.query.unitId);

    // Delete roster ids since they're meaningless to the user.
    for (const individual of individuals) {
      delete (individual as any).id;
    }

    const csv = await json2csvAsync(individuals);

    res.header('Content-Type', 'text/csv');
    res.attachment('muster-noncompliance.csv');
    res.send(csv);
  }

  async getTrends(req: ApiRequest<OrgParam, null, GetTrendsQuery>, res: Response) {
    const weeksCount = parseInt(req.query.weeksCount ?? '6');
    const monthsCount = parseInt(req.query.monthsCount ?? '6');

    const unitRosterCounts = {
      weekly: await getUnitRosterCounts('week', weeksCount),
      monthly: await getUnitRosterCounts('month', monthsCount),
    };

    // Get unique dates and unit names.
    const weeklyDates = new Set<string>();
    const monthlyDates = new Set<string>();
    const unitIds = new Set<string>();

    for (const date of Object.keys(unitRosterCounts.weekly)) {
      weeklyDates.add(date);

      for (const unitId of Object.keys(unitRosterCounts.weekly[date])) {
        unitIds.add(unitId);
      }
    }

    for (const date of Object.keys(unitRosterCounts.monthly)) {
      monthlyDates.add(date);

      for (const unitId of Object.keys(unitRosterCounts.monthly[date])) {
        unitIds.add(unitId);
      }
    }

    //
    // Build elastcisearch multisearch queries.
    //
    const esBody = [] as any[];

    // Weekly ES Queries
    for (const unitId of unitIds) {
      esBody.push({
        index: req.appRole!.getKibanaIndexForMuster(unitId),
      });
      esBody.push({
        size: 0,
        query: {
          bool: {
            must: [{
              range: {
                Timestamp: {
                  gte: `now-${weeksCount}w/w`,
                  lt: 'now/w',
                },
              },
            }],
          },
        },
        aggs: {
          reportsHistogram: {
            date_histogram: {
              field: 'Timestamp',
              interval: 'week',
            },
          },
        },
      });
    }

    // Monthly ES Queries
    for (const unitId of unitIds) {
      esBody.push({
        index: req.appRole!.getKibanaIndexForMuster(unitId),
      });
      esBody.push({
        size: 0,
        query: {
          bool: {
            must: [{
              range: {
                Timestamp: {
                  gte: `now-${monthsCount}M/M`,
                  lt: 'now/M',
                },
              },
            }],
          },
        },
        aggs: {
          reportsHistogram: {
            date_histogram: {
              field: 'Timestamp',
              interval: 'month',
            },
          },
        },
      });
    }

    // Send request.
    let response: MSearchResponse<unknown>;
    try {
      response = await elasticsearch.msearch({ body: esBody });
    } catch (err) {
      throw new InternalServerError(`Elasticsearch: ${err.message}`);
    }

    //
    // Calculate and organize data.
    //
    type UnitStatsByDate = {
      [date: string]: {
        [unitId: string]: {
          nonMusterPercent: number,
          reportsCount: number
          rosterCount: number
        }
      }
    };

    const unitStats = {
      weekly: {} as UnitStatsByDate,
      monthly: {} as UnitStatsByDate,
    };

    // Weekly
    for (const date of weeklyDates) {
      unitStats.weekly[date] = {};
    }

    let responseIndex = 0;
    for (const unitId of unitIds) {
      let buckets: {
        key_as_string: string
        key: number
        doc_count: number
      }[];
      if (!response.responses![responseIndex].aggregations) {
        buckets = [];
      } else {
        buckets = response.responses![responseIndex].aggregations.reportsHistogram.buckets as {
          key_as_string: string
          key: number
          doc_count: number
        }[];
      }

      for (const bucket of buckets) {
        const date = moment.utc(bucket.key).format(dateFormat);
        const reportsCount = bucket.doc_count;
        const rosterCount = unitRosterCounts.weekly[date][unitId];

        const nextWeek = moment.utc(date).add(1, 'week');
        const maxReportsCount = rosterCount * nextWeek.diff(date, 'days');

        unitStats.weekly[date][unitId] = {
          nonMusterPercent: calcNonMusterPercent(reportsCount, maxReportsCount),
          rosterCount,
          reportsCount,
        };
      }
      responseIndex += 1;
    }

    // Any units that weren't found must not have any reports. Add them manually.
    for (const date of weeklyDates) {
      for (const unitId of unitIds) {
        if (!unitStats.weekly[date][unitId]) {
          unitStats.weekly[date][unitId] = {
            nonMusterPercent: 100,
            rosterCount: unitRosterCounts.weekly[date][unitId],
            reportsCount: 0,
          };
        }
      }
    }

    // Monthly
    for (const date of monthlyDates) {
      unitStats.monthly[date] = {};
    }

    for (const unitId of unitIds) {
      let buckets: {
        key_as_string: string
        key: number
        doc_count: number
      }[];
      if (!response.responses![responseIndex].aggregations) {
        buckets = [];
      } else {
        buckets = response.responses![responseIndex].aggregations.reportsHistogram.buckets as {
          key_as_string: string
          key: number
          doc_count: number
        }[];
      }

      for (const bucket of buckets) {
        const date = moment.utc(bucket.key).format(dateFormat);
        const reportsCount = bucket.doc_count;
        const rosterCount = unitRosterCounts.monthly[date][unitId];

        const nextMonth = moment.utc(date).add(1, 'month');
        const maxReportsCount = rosterCount * nextMonth.diff(date, 'days');

        unitStats.monthly[date][unitId] = {
          nonMusterPercent: calcNonMusterPercent(reportsCount, maxReportsCount),
          rosterCount,
          reportsCount,
        };
      }
      responseIndex += 1;
    }

    // Any units that weren't found must not have any reports. Add them manually.
    for (const date of monthlyDates) {
      for (const unitId of unitIds) {
        if (!unitStats.monthly[date][unitId]) {
          unitStats.monthly[date][unitId] = {
            nonMusterPercent: 100,
            rosterCount: unitRosterCounts.monthly[date][unitId],
            reportsCount: 0,
          };
        }
      }
    }

    res.json(unitStats);
  }

  async getClosedMusterWindows(req: ApiRequest<null, null, GetClosedMusterWindowsQuery>, res: Response) {
    const since = parseInt(req.query.since);
    const until = parseInt(req.query.until);
    // Get all units with muster configurations
    const unitsWithMusterConfigs = await Unit
      .createQueryBuilder('unit')
      .leftJoinAndSelect('unit.org', 'org')
      .where('json_array_length(unit.muster_configuration) > 0')
      .getMany();

    const musterWindows: MusterWindow[] = [];

    for (const unit of unitsWithMusterConfigs) {
      for (const muster of unit.musterConfiguration) {
        // Get the unix timestamp of the earliest possible muster window, it could be in the previous week if the
        // muster window spans the week boundary.
        const musterTime = moment(muster.startTime, 'HH:mm');
        let current = moment
          .unix(since - muster.durationMinutes * 60)
          .tz(muster.timezone)
          .startOf('week')
          .add(musterTime.hour(), 'hours')
          .add(musterTime.minutes(), 'minutes')
          .unix();
        const durationSeconds = muster.durationMinutes * 60;
        // Loop through each week
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

    let minDistance: number | null = null;
    let closestMuster: MusterConfiguration | undefined;
    let closestStart = 0;
    let closestEnd = 0;

    for (const muster of unit.musterConfiguration) {
      if (muster.days === DaysOfTheWeek.None) {
        continue;
      }
      // Get the unix timestamp of the earliest possible muster window in the week of the timestamp
      const musterTime = moment(muster.startTime, 'HH:mm');
      let current = moment
        .unix(timestamp)
        .tz(muster.timezone)
        .startOf('week')
        .add(musterTime.hour(), 'hours')
        .add(musterTime.minutes(), 'minutes')
        .unix();
      const durationSeconds = muster.durationMinutes * 60;
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
          const distanceToWindow = timestamp > end ? timestamp - end : (timestamp < current ? timestamp - current : 0);
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
        const distanceToWindow = timestamp > windowEnd ? timestamp - windowEnd : (timestamp < windowStart ? timestamp - windowStart : 0);
        if (Math.abs(minDistance!) > Math.abs(distanceToWindow)) {
          closestMuster = muster;
          closestStart = windowStart;
          closestEnd = windowEnd;
        }
      }
    }

    res.json(closestMuster ? buildMusterWindow(unit, closestStart, closestEnd, closestMuster) : null);
  }

}

function buildMusterWindow(unit: Unit, startTimestamp: number, endTimestamp: number, muster: MusterConfiguration): MusterWindow {
  return {
    id: `${unit.org!.id}-${unit.id}-${moment.unix(startTimestamp).utc().format('Y-M-D-HH-mm')}`,
    orgId: unit.org!.id,
    unitId: unit.id,
    startTimestamp,
    endTimestamp,
    startTime: muster.startTime,
    timezone: muster.timezone,
    durationMinutes: muster.durationMinutes,
  };
}

//
// Helpers
//

async function getIndividualsData(org: Org, role: Role, intervalCount: number, unitId?: string) {
  // HACK: The database queries in this function are extremely inefficient for large rosters, and need to be revised
  // once the new elasticsearch muster data architecture is put in place.

  let rosterEntries: Roster[];
  if (unitId) {
    rosterEntries = await Roster.find({
      relations: ['unit', 'unit.org'],
      where: (qb: any) => {
        qb.where('unit_id = :unitId', { unitId })
          .andWhere('unit_org = :orgId', { orgId: org.id });
      },
    });
  } else {
    rosterEntries = await Roster.find({
      relations: ['unit', 'unit.org'],
      where: (qb: any) => {
        qb.where('unit_org = :orgId', { orgId: org.id });
      },
    });
  }

  const allowedRosterColumns = await getAllowedRosterColumns(org, role);

  // Calculate each individual's max reports for this time range.
  const maxReportsByEdipi = {} as { [edipi: string]: number };
  const timeRange = {
    startDate: moment().startOf('day').subtract(intervalCount, 'days'),
    endDate: moment().startOf('day'),
  };

  for (const entry of rosterEntries) {
    let startDate = moment(entry.startDate ?? timeRange.startDate).startOf('day');
    if (startDate < timeRange.startDate) {
      startDate = timeRange.startDate;
    }

    let endDate = moment(entry.endDate ?? timeRange.endDate).startOf('day');
    if (endDate > timeRange.endDate) {
      endDate = timeRange.endDate;
    }

    maxReportsByEdipi[entry.edipi] = endDate.diff(startDate, 'days');
  }

  // Send request.
  let response: SearchResponse<unknown>;
  try {
    response = await elasticsearch.search({
      index: role.getKibanaIndexForMuster(unitId),
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              range: {
                Timestamp: {
                  gte: timeRange.startDate.format(dateFormat),
                  lt: timeRange.endDate.format(dateFormat),
                },
              },
            }],
          },
        },
        aggs: {
          reportsByPerson: {
            terms: {
              size: 10000,
              field: 'Roster.edipi.keyword',
            },
          },
        },
      },
    });
  } catch (err) {
    throw new InternalServerError(`Elasticsearch: ${err.message}`);
  }

  const reportsByPersonBuckets = (response.aggregations ? response.aggregations.reportsByPerson.buckets : []) as {
    key: string
    doc_count: number
  }[];

  const esReportsByEdipi = {} as {[edipi: string]: number};
  for (const bucket of reportsByPersonBuckets) {
    esReportsByEdipi[bucket.key] = bucket.doc_count;
  }

  // Calculate non-muster percents.
  const individuals = [] as MusterIndividual[];
  for (const rosterEntry of (rosterEntries as MusterIndividual[])) {
    const reports = esReportsByEdipi[rosterEntry.edipi] ?? 0;
    const maxReports = maxReportsByEdipi[rosterEntry.edipi];
    const nonMusterPercent = calcNonMusterPercent(reports, maxReports);
    if (nonMusterPercent > 0) {
      const individual = rosterEntry as MusterIndividual;
      individual.nonMusterPercent = nonMusterPercent;
      individuals.push(individual);
    }
  }

  individuals.sort((a, b) => {
    let diff = b.nonMusterPercent - a.nonMusterPercent;
    if (diff !== 0) {
      return diff;
    }

    diff = a.unit.name.localeCompare(b.unit.name);
    if (diff !== 0) {
      return diff;
    }

    diff = a.lastName.localeCompare(b.lastName);
    if (diff !== 0) {
      return diff;
    }

    return a.firstName.localeCompare(b.firstName);
  });

  // Only return data the user has permissions for.
  return individuals.map(individual => {
    const individualCleaned = {} as MusterIndividual;
    for (const columnInfo of allowedRosterColumns) {
      const columnValue = individual.getColumnValue(columnInfo);
      Reflect.set(individualCleaned, columnInfo.name, columnValue);
    }
    individualCleaned.id = individual.id;
    individualCleaned.unitId = individual.unit.id;
    individualCleaned.nonMusterPercent = individual.nonMusterPercent;
    return individualCleaned;
  });
}

async function getUnitRosterCounts(interval: 'week' | 'month', intervalCount: number) {
  const momentUnitOfTime = {
    week: 'isoWeek',
    month: 'month',
  }[interval] as unitOfTime.StartOf;

  // Query the number of individuals grouped by unit who were active between the start/end dates.
  // NOTE: There may be a more efficient way of doing this where we don't require a union of multiple queries, but this
  // should work well enough as long as the interval count isn't too high.
  const queries = [] as string[];
  const dates = new Set<string>();
  for (let i = 0; i < intervalCount; i++) {
    const startDate = moment.utc().subtract(i + 1, interval).startOf(momentUnitOfTime).format(dateFormat);
    const endDate = moment.utc(startDate).add(1, interval).format(dateFormat);
    queries.push(`
      SELECT unit_id as "unitId", count(id), '${startDate}' as date
      FROM roster
      WHERE
        (start_date IS null AND (end_date IS null OR end_date > '${endDate}'))
        OR (start_date <= '${startDate}' AND (end_date IS null OR end_date > '${endDate}'))
      GROUP BY "unitId"
    `);

    dates.add(startDate);
  }

  const rows = await getConnection().query(queries.join(`UNION`)) as {
    unitId: string
    date: string
    count: string
  }[];

  const unitRosterCountByDate = {} as {
    [date: string]: {
      [unitId: string]: number
    }
  };

  // Make sure all of the dates have entries, even if the query didn't return any data for some.
  for (const date of dates) {
    if (!unitRosterCountByDate[date]) {
      unitRosterCountByDate[date] = {};
    }
  }

  for (const row of rows) {
    const date = row.date;
    const unitId = row.unitId;

    if (!unitRosterCountByDate[date][unitId]) {
      unitRosterCountByDate[date][unitId] = 0;
    }

    unitRosterCountByDate[date][unitId] += parseInt(row.count);
  }

  return unitRosterCountByDate;
}

function calcNonMusterPercent(reports: number, maxReports: number) {
  if (maxReports === 0) {
    return 0;
  }

  const nonMusterRatio = 1 - (reports / maxReports);
  return Math.min(Math.max(nonMusterRatio, 0), 1) * 100;
}

type GetIndividualsQuery = {
  intervalCount: string
  unitId: string
} & PagedQuery;

type GetTrendsQuery = {
  weeksCount?: string
  monthsCount?: string
};

type GetClosedMusterWindowsQuery = {
  since: string
  until: string
};

type GetNearestMusterWindowQuery = {
  timestamp: string
};

type MusterIndividual = {
  nonMusterPercent: number
  unitId: string
} & Roster;

interface MusterWindow {
  id: string,
  unitId: string,
  orgId: number,
  startTimestamp: number,
  endTimestamp: number,
  startTime: string,
  timezone: string,
  durationMinutes: number,
}

export default new MusterController();
