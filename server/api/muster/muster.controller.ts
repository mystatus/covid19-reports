import moment, { unitOfTime } from 'moment';
import _ from 'lodash';
import { MSearchResponse, SearchResponse } from 'elasticsearch';
import { Response } from 'express';
import { getConnection } from 'typeorm';
import { json2csvAsync } from 'json-2-csv';
import elasticsearch from '../../elasticsearch/elasticsearch';
import { InternalServerError } from '../../util/error-types';
import {
  ApiRequest, OrgParam, OrgRoleParams, PagedQuery,
} from '../index';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { getAllowedRosterColumns, RosterEntryData } from '../roster/roster.controller';
import { Roster } from '../roster/roster.model';

const dateFormat = 'YYYY-MM-DD';

function unitNameToId(unitName: string) {
  return _.camelCase(unitName);
}

class MusterController {

  // TODO: Support custom muster intervals.
  async getIndividuals(req: ApiRequest<OrgRoleParams, null, GetIndividualsQuery>, res: Response) {
    const intervalCount = parseInt(req.query.intervalCount ?? '1');
    const limit = parseInt(req.query.limit ?? '10');
    const page = parseInt(req.query.page ?? '0');

    const individuals = await getIndividualsData(req.appOrg!, req.appRole!, intervalCount, req.query.unit);

    const offset = page * limit;

    return res.json({
      rows: individuals.slice(offset, offset + limit),
      totalRowsCount: individuals.length,
    });
  }

  async exportIndividuals(req: ApiRequest<OrgParam, null, GetIndividualsQuery>, res: Response) {
    const intervalCount = parseInt(req.query.intervalCount ?? '1');

    const individuals = await getIndividualsData(req.appOrg!, req.appRole!, intervalCount, req.query.unit);

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
    const unitNames = new Set<string>();
    const unitNameIds = new Set<string>();

    for (const date of Object.keys(unitRosterCounts.weekly)) {
      weeklyDates.add(date);

      for (const unitName of Object.keys(unitRosterCounts.weekly[date])) {
        unitNames.add(unitName);
        unitNameIds.add(unitNameToId(unitName));
      }
    }

    for (const date of Object.keys(unitRosterCounts.monthly)) {
      monthlyDates.add(date);

      for (const unitName of Object.keys(unitRosterCounts.monthly[date])) {
        unitNames.add(unitName);
        unitNameIds.add(unitNameToId(unitName));
      }
    }

    //
    // Build elastcisearch multisearch queries.
    //
    const esBody = [] as any[];

    // Weekly ES Query
    esBody.push({
      index: req.appRole!.getKibanaIndexForMuster(),
    });

    const esWeeklyBody = {
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
      aggs: {},
    } as any;

    const unitWeeklyAggNameList = [];
    for (const unitName of unitNames) {
      const unitNameId = unitNameToId(unitName);
      unitWeeklyAggNameList.push(unitNameId);

      esWeeklyBody.aggs[unitNameId] = {
        filter: {
          term: {
            'Roster.unit.keyword': unitName,
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
      };
    }

    esBody.push(esWeeklyBody);

    // Montly ES Query
    esBody.push({
      index: req.appRole!.getKibanaIndexForMuster(),
    });

    const esMonthlyBody = {
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
      aggs: {},
    } as any;

    const unitMonthlyAggNameList = [];
    for (const unitName of unitNames) {
      const unitNameId = unitNameToId(unitName);
      unitMonthlyAggNameList.push(unitNameId);

      esMonthlyBody.aggs[unitNameId] = {
        filter: {
          term: {
            'Roster.unit.keyword': unitName,
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
      };
    }

    esBody.push(esMonthlyBody);

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
        [unitName: string]: {
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

    for (const unitName of unitNames) {
      const unitNameId = unitNameToId(unitName);
      const buckets = response.responses![0].aggregations[unitNameId].reportsHistogram.buckets as {
        key_as_string: string
        key: number
        doc_count: number
      }[];

      for (const bucket of buckets) {
        const date = moment.utc(bucket.key).format(dateFormat);
        const reportsCount = bucket.doc_count;
        const rosterCount = unitRosterCounts.weekly[date][unitName];

        const nextWeek = moment.utc(date).add(1, 'week');
        const maxReportsCount = rosterCount * nextWeek.diff(date, 'days');

        unitStats.weekly[date][unitName] = {
          nonMusterPercent: calcNonMusterPercent(reportsCount, maxReportsCount),
          rosterCount,
          reportsCount,
        };
      }
    }

    // Any units that weren't found must not have any reports. Add them manually.
    for (const date of weeklyDates) {
      for (const unitName of unitNames) {
        if (!unitStats.weekly[date][unitName]) {
          unitStats.weekly[date][unitName] = {
            nonMusterPercent: 100,
            rosterCount: unitRosterCounts.weekly[date][unitName],
            reportsCount: 0,
          };
        }
      }
    }

    // Monthly
    for (const date of monthlyDates) {
      unitStats.monthly[date] = {};
    }

    for (const unitName of unitNames) {
      const unitNameId = unitNameToId(unitName);
      const buckets = response.responses![1].aggregations[unitNameId].reportsHistogram.buckets as {
        key_as_string: string
        key: number
        doc_count: number
      }[];

      for (const bucket of buckets) {
        const date = moment.utc(bucket.key).format(dateFormat);
        const reportsCount = bucket.doc_count;
        const rosterCount = unitRosterCounts.monthly[date][unitName];

        const nextMonth = moment.utc(date).add(1, 'month');
        const maxReportsCount = rosterCount * nextMonth.diff(date, 'days');

        unitStats.monthly[date][unitName] = {
          nonMusterPercent: calcNonMusterPercent(reportsCount, maxReportsCount),
          rosterCount,
          reportsCount,
        };
      }
    }

    // Any units that weren't found must not have any reports. Add them manually.
    for (const date of monthlyDates) {
      for (const unitName of unitNames) {
        if (!unitStats.monthly[date][unitName]) {
          unitStats.monthly[date][unitName] = {
            nonMusterPercent: 100,
            rosterCount: unitRosterCounts.monthly[date][unitName],
            reportsCount: 0,
          };
        }
      }
    }

    res.json(unitStats);
  }

}

//
// Helpers
//

async function getIndividualsData(org: Org, role: Role, intervalCount: number, unit?: string) {
  // HACK: The database queries in this function are extremely inefficient for large rosters, and need to be revised
  // once the new elasticsearch muster data architecture is put in place.

  let rosterEntries: Roster[];
  if (unit) {
    rosterEntries = await Roster.find({
      where: {
        org,
        unit,
      },
    });
  } else {
    rosterEntries = await Roster.find({
      where: {
        org,
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

  // Aggregate all existing reports within this time interval.
  const filter = [{
    range: {
      Timestamp: {
        gte: timeRange.startDate.format(dateFormat),
        lt: timeRange.endDate.format(dateFormat),
      },
    },
  }] as any[];

  if (unit) {
    filter.push({
      term: {
        'Roster.unit.keyword': unit,
      },
    });
  }

  // Send request.
  let response: SearchResponse<unknown>;
  try {
    response = await elasticsearch.search({
      index: role.getKibanaIndexForMuster(),
      body: {
        size: 0,
        query: {
          bool: {
            filter,
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

  const reportsByPersonBuckets = response.aggregations.reportsByPerson.buckets as {
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

    diff = a.unit.localeCompare(b.unit);
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
      SELECT unit, count(id), '${startDate}' as date
      FROM roster
      WHERE
        (start_date IS null AND (end_date IS null OR end_date > '${endDate}'))
        OR (start_date <= '${startDate}' AND (end_date IS null OR end_date > '${endDate}'))
      GROUP BY unit
    `);

    dates.add(startDate);
  }

  const rows = await getConnection().query(queries.join(`UNION`)) as {
    unit: string
    date: string
    count: string
  }[];

  const unitRosterCountByDate = {} as {
    [date: string]: {
      [unitName: string]: number
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
    const unit = row.unit;

    if (!unitRosterCountByDate[date][unit]) {
      unitRosterCountByDate[date][unit] = 0;
    }

    unitRosterCountByDate[date][unit] += parseInt(row.count);
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
  unit: string
} & PagedQuery;

type GetTrendsQuery = {
  weeksCount?: string
  monthsCount?: string
};

type MusterIndividual = {
  nonMusterPercent: number
} & Roster;

export default new MusterController();
