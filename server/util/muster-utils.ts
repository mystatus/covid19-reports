import { SearchResponse } from 'elasticsearch';
import moment, { unitOfTime } from 'moment-timezone';
import { getConnection } from 'typeorm';
import { Org } from '../api/org/org.model';
import { Role } from '../api/role/role.model';
import { Roster } from '../api/roster/roster.model';
import {
  MusterConfiguration,
  Unit,
} from '../api/unit/unit.model';
import elasticsearch from '../elasticsearch/elasticsearch';
import { InternalServerError } from './error-types';

export const musterUtils = {

  get dateFormat() {
    return 'YYYY-MM-DD';
  },

  async getIndividualsData(org: Org, role: Role, intervalCount: number, unitId?: string) {
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

    const allowedRosterColumns = await Roster.getAllowedColumns(org, role);

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
                    gte: timeRange.startDate.format(musterUtils.dateFormat),
                    lt: timeRange.endDate.format(musterUtils.dateFormat),
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

    const esReportsByEdipi = {} as { [edipi: string]: number };
    for (const bucket of reportsByPersonBuckets) {
      esReportsByEdipi[bucket.key] = bucket.doc_count;
    }

    // Calculate non-muster percents.
    const individuals = [] as MusterIndividual[];
    for (const rosterEntry of (rosterEntries as MusterIndividual[])) {
      const reports = esReportsByEdipi[rosterEntry.edipi] ?? 0;
      const maxReports = maxReportsByEdipi[rosterEntry.edipi];
      const nonMusterPercent = musterUtils.calcNonMusterPercent(reports, maxReports);
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
  },

  async getUnitRosterCounts(role: Role, interval: 'week' | 'month', intervalCount: number) {
    const momentUnitOfTime = {
      week: 'isoWeek',
      month: 'month',
    }[interval] as unitOfTime.StartOf;

    const params = [] as any[];
    const orgIdParamIndex = addParam(params, role.org!.id);
    const unitFilter = role.getUnitFilter().replace('*', '%');
    const unitFilterParamIndex = addParam(params, unitFilter);

    // Query the number of individuals grouped by unit who were active between the start/end dates.
    // NOTE: There may be a more efficient way of doing this where we don't require a union of multiple queries, but this
    // should work well enough as long as the interval count isn't too high.
    const queries = [] as string[];
    const dates = new Set<string>();
    for (let i = 0; i < intervalCount; i++) {
      const startDate = moment.utc().subtract(i + 1, interval).startOf(momentUnitOfTime).format(musterUtils.dateFormat);
      const endDate = moment.utc(startDate).add(1, interval).format(musterUtils.dateFormat);
      const startDateParamIndex = addParam(params, startDate);
      const endDateParamIndex = addParam(params, endDate);
      queries.push(`
        SELECT unit_id as "unitId", count(id), $${startDateParamIndex}::varchar as date
        FROM roster
        WHERE
          unit_org = $${orgIdParamIndex} AND
          unit_id LIKE $${unitFilterParamIndex} AND
          (start_date IS null AND (end_date IS null OR end_date > $${endDateParamIndex}::date))
          OR (start_date <= $${startDateParamIndex}::date AND (end_date IS null OR end_date > $${endDateParamIndex}::date))
        GROUP BY "unitId"
      `);

      dates.add(startDate);
    }

    const rows = await getConnection().query(queries.join(`UNION`), params) as {
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
  },

  calcNonMusterPercent(reports: number, maxReports: number) {
    if (maxReports === 0) {
      return 0;
    }

    const nonMusterRatio = 1 - (reports / maxReports);
    return Math.min(Math.max(nonMusterRatio, 0), 1) * 100;
  },

  getEarliestMusterWindowTime(muster: MusterConfiguration, referenceTime: number) {
    const musterTime = moment(muster.startTime, 'HH:mm');
    return moment
      .unix(referenceTime)
      .tz(muster.timezone)
      .startOf('week')
      .add(musterTime.hour(), 'hours')
      .add(musterTime.minutes(), 'minutes')
      .unix();
  },

  buildMusterWindow(unit: Unit, startTimestamp: number, endTimestamp: number, muster: MusterConfiguration): MusterWindow {
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
  },

  getDistanceToWindow(start: number, end: number, time: number) {
    if (time > end) {
      return time - end;
    }
    if (time < start) {
      return time - start;
    }
    return 0;
  },

};

function addParam(params: any[], data: any) {
  params.push(data);
  return params.length;
}

export type MusterIndividual = {
  nonMusterPercent: number
  unitId: string
} & Roster;

export interface MusterWindow {
  id: string,
  unitId: string,
  orgId: number,
  startTimestamp: number,
  endTimestamp: number,
  startTime: string,
  timezone: string,
  durationMinutes: number,
}
