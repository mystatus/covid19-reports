import moment from 'moment-timezone';
import { MSearchResponse } from 'elasticsearch';
import { Response } from 'express';
import elasticsearch from '../../elasticsearch/elasticsearch';
import { InternalServerError, NotFoundError } from '../../util/error-types';
import {
  musterUtils,
  MusterWindow,
} from '../../util/muster-utils';
import {
  ApiRequest, OrgRoleParams, OrgUnitParams, PagedQuery,
} from '../index';
import { MusterConfiguration, Unit } from '../unit/unit.model';
import {
  dayIsIn, DaysOfTheWeek, nextDay, oneDaySeconds,
} from '../../util/util';

class MusterController {

  // TODO: Support custom muster intervals.
  async getIndividuals(req: ApiRequest<OrgRoleParams, null, GetIndividualsQuery>, res: Response) {
    const intervalCount = parseInt(req.query.intervalCount ?? '1');
    const limit = parseInt(req.query.limit ?? '10');
    const page = parseInt(req.query.page ?? '0');

    const individuals = await musterUtils.getIndividualsData(req.appOrg!, req.appRole!, intervalCount, req.query.unitId);

    const offset = page * limit;

    return res.json({
      rows: individuals.slice(offset, offset + limit),
      totalRowsCount: individuals.length,
    });
  }

  async getTrends(req: ApiRequest<null, null, GetTrendsQuery>, res: Response) {
    const weeksCount = parseInt(req.query.weeksCount ?? '6');
    const monthsCount = parseInt(req.query.monthsCount ?? '6');

    const unitRosterCounts = {
      weekly: await musterUtils.getUnitRosterCounts(req.appOrg!, 'week', weeksCount),
      monthly: await musterUtils.getUnitRosterCounts(req.appOrg!, 'month', monthsCount),
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
        const date = moment.utc(bucket.key).format(musterUtils.dateFormat);
        const reportsCount = bucket.doc_count;
        const rosterCount = unitRosterCounts.weekly[date][unitId];

        const nextWeek = moment.utc(date).add(1, 'week');
        const maxReportsCount = rosterCount * nextWeek.diff(date, 'days');

        unitStats.weekly[date][unitId] = {
          nonMusterPercent: musterUtils.calcNonMusterPercent(reportsCount, maxReportsCount),
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
        const date = moment.utc(bucket.key).format(musterUtils.dateFormat);
        const reportsCount = bucket.doc_count;
        const rosterCount = unitRosterCounts.monthly[date][unitId];

        const nextMonth = moment.utc(date).add(1, 'month');
        const maxReportsCount = rosterCount * nextMonth.diff(date, 'days');

        unitStats.monthly[date][unitId] = {
          nonMusterPercent: musterUtils.calcNonMusterPercent(reportsCount, maxReportsCount),
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
        let current = musterUtils.getEarliestMusterWindowTime(muster, since - muster.durationMinutes * 60);
        const durationSeconds = muster.durationMinutes * 60;
        // Loop through each week
        while (current < until) {
          // Loop through each day of week to see if any of the windows ended in the query window
          for (let day = DaysOfTheWeek.Sunday; day <= DaysOfTheWeek.Saturday && current < until; day = nextDay(day)) {
            const end = current + durationSeconds;
            // If the window ended in the query window, add it to the list
            if (end > since && end <= until && dayIsIn(day, muster.days)) {
              musterWindows.push(musterUtils.buildMusterWindow(unit, current, end, muster));
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
      let current = musterUtils.getEarliestMusterWindowTime(muster, timestamp);
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
          const distanceToWindow = musterUtils.getDistanceToWindow(current, end, timestamp);
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
        const distanceToWindow = musterUtils.getDistanceToWindow(windowStart, windowEnd, timestamp);
        if (Math.abs(minDistance!) > Math.abs(distanceToWindow)) {
          closestMuster = muster;
          closestStart = windowStart;
          closestEnd = windowEnd;
        }
      }
    }

    res.json(closestMuster ? musterUtils.buildMusterWindow(unit, closestStart, closestEnd, closestMuster) : null);
  }

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

export default new MusterController();
