import {
  MSearchResponse,
  SearchResponse,
} from 'elasticsearch';
import moment from 'moment-timezone';
import { Like } from 'typeorm';
import { Org } from '../api/org/org.model';
import { Role } from '../api/role/role.model';
import { Roster } from '../api/roster/roster.model';
import {
  MusterConfiguration,
  Unit,
} from '../api/unit/unit.model';
import elasticsearch from '../elasticsearch/elasticsearch';
import { InternalServerError } from './error-types';
import {
  getEsDateFormat,
  getEsTimeInterval,
  getMomentDateFormat,
  TimeInterval,
} from './util';

export const musterUtils = {

  /**
   * Get muster stats for each individual on the roster, given a time range and optional unit to filter by. The returned
   * data will include each individual's muster stats merged with their roster data.
   */
  async getRosterMusterStats(args: {
    org: Org
    role: Role
    interval: TimeInterval
    intervalCount: number
    unitId?: string
  }) {
    const { org, role, interval, intervalCount, unitId } = args;

    // Send ES request.
    let response: SearchResponse<never>;
    try {
      response = await elasticsearch.search({
        index: role.getKibanaIndexForMuster(unitId),
        body: buildIndividualsMusterBody({
          interval,
          intervalCount,
        }),
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerError(`Elasticsearch: ${err.message}`);
    }

    // Get allowed roster data for the individuals returned from ES.
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

    const rosterEntriesByEdipi: { [edipi: string]: Roster } = {};
    rosterEntries.forEach(e => {
      rosterEntriesByEdipi[e.edipi] = e;
    });

    const allowedRosterColumns = await Roster.getAllowedColumns(org, role);

    const aggs = response.aggregations as {
      muster: {
        buckets: Array<{
          key: {
            edipi: string
            reported: boolean
          }
          doc_count: number
        }>
      }
    };

    // Collect reports and reports missed.
    const individualStats: IndividualStats = {};

    for (const bucket of aggs.muster.buckets) {
      const { edipi, reported } = bucket.key;

      if (!individualStats[edipi]) {
        individualStats[edipi] = {
          mustersReported: 0,
          mustersNotReported: 0,
          nonMusterPercent: 0,
        };
      }

      if (reported) {
        individualStats[edipi].mustersReported = bucket.doc_count;
      } else {
        individualStats[edipi].mustersNotReported = bucket.doc_count;
      }
    }

    // Calculate non-muster percents.
    for (const edipi of Object.keys(individualStats)) {
      const data = individualStats[edipi];
      individualStats[edipi].nonMusterPercent = musterUtils.calcNonMusterPercent(data.mustersReported, data.mustersNotReported);
    }

    // Build a sorted array of the individuals' stats merged with their roster data.
    const individuals = Object.keys(individualStats)
      .filter(edipi => {
        return (
          rosterEntriesByEdipi[edipi]
          && individualStats[edipi].nonMusterPercent > 0
        );
      })
      .sort((edipiA, edipiB) => {
        const entryA = rosterEntriesByEdipi[edipiA];
        const entryB = rosterEntriesByEdipi[edipiB];
        const individualA = individualStats[edipiA];
        const individualB = individualStats[edipiB];

        let diff = individualB.nonMusterPercent - individualA.nonMusterPercent;
        if (diff === 0) {
          diff = entryA.unit?.name.localeCompare(entryB.unit!.name) ?? 0;
        }
        if (diff === 0) {
          diff = entryA.lastName?.localeCompare(entryB.lastName!) ?? 0;
        }
        if (diff === 0) {
          diff = entryA.firstName?.localeCompare(entryB.firstName!) ?? 0;
        }
        return diff;
      })
      .map(edipi => {
        const rosterEntryCleaned: Partial<Roster> = {};
        const rosterEntry = rosterEntriesByEdipi[edipi];
        const individual = individualStats[edipi];
        for (const columnInfo of allowedRosterColumns) {
          const columnValue = rosterEntry.getColumnValue(columnInfo);
          Reflect.set(rosterEntryCleaned, columnInfo.name, columnValue);
        }
        return {
          ...individual,
          ...rosterEntryCleaned,
          unitId: rosterEntry.unit.id,
        } as IndividualStats[string] & Partial<Roster>;
      });

    return individuals;
  },

  /**
   * Get aggregated unit muster stats over the given weeks/months.
   */
  async getUnitMusterStats(args: {
    role: Role
    weeksCount: number
    monthsCount: number
  }) {
    const { role, weeksCount, monthsCount } = args;

    // Get unit names.
    const unitIdFilter = role.getUnitFilter().replace('*', '%');
    const units = await Unit.find({
      where: {
        org: role.org,
        id: Like(unitIdFilter),
      },
    });

    const unitNames = units.map(u => u.name);

    //
    // Build elastcisearch multisearch queries.
    //
    const index = role.getKibanaIndexForMuster();
    const esBody = [
      { index },
      buildMusterEsBody({
        interval: 'week',
        intervalCount: weeksCount,
      }),

      { index },
      buildMusterEsBody({
        interval: 'month',
        intervalCount: monthsCount,
      }),
    ] as any[];

    // Send ES request.
    let response: MSearchResponse<unknown>;
    try {
      response = await elasticsearch.msearch({ body: esBody });
    } catch (err) {
      console.error(err);
      throw new InternalServerError(`Elasticsearch: ${err.message}`);
    }

    //
    // Organize and return data.
    //
    const weeklyAggs = response.responses![0].aggregations as MusterAggregation;
    const monthlyAggs = response.responses![1].aggregations as MusterAggregation;

    return {
      weekly: buildUnitStats({
        aggregations: weeklyAggs,
        unitNames,
        interval: 'week',
        intervalCount: weeksCount,
      }),
      monthly: buildUnitStats({
        aggregations: monthlyAggs,
        unitNames,
        interval: 'month',
        intervalCount: monthsCount,
      }),
    };
  },

  calcNonMusterPercent(mustersReported: number, mustersNotReported: number) {
    const totalReports = mustersReported + mustersNotReported;
    if (totalReports === 0) {
      return 0;
    }

    const nonMusterPercent = (mustersNotReported / totalReports) * 100;

    if (nonMusterPercent < 0 || nonMusterPercent > 100) {
      console.warn(`Invalid non-muster percent (${nonMusterPercent}). It should be between 0 and 100.`);
    }

    return nonMusterPercent;
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
      unitName: unit.name,
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

function buildIndividualsMusterBody({
  interval,
  intervalCount,
}: {
  interval: TimeInterval,
  intervalCount: number
}) {
  const esInterval = getEsTimeInterval(interval);

  return {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              Timestamp: {
                gte: `now-${intervalCount}${esInterval}/${esInterval}`,
                lte: `now/${esInterval}`,
              },
            },
          },
        ],
      },
    },
    aggs: {
      muster: {
        composite: {
          size: 10000,
          sources: [
            {
              edipi: {
                terms: {
                  field: 'Roster.edipi.keyword',
                },
              },
            },
            {
              reported: {
                terms: {
                  field: 'Muster.reported',
                  missing_bucket: true,
                },
              },
            },
          ],
        },
      },
    },
  };
}

function buildMusterEsBody({
  interval,
  intervalCount,
}: {
  interval: TimeInterval,
  intervalCount: number
}) {
  const esInterval = getEsTimeInterval(interval);

  return {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              Timestamp: {
                gte: `now-${intervalCount}${esInterval}/${esInterval}`,
                lt: `now/${esInterval}`,
              },
            },
          },
        ],
      },
    },
    aggs: {
      muster: {
        composite: {
          size: 10000,
          sources: [
            {
              date: {
                date_histogram: {
                  field: 'Timestamp',
                  interval: `1${esInterval}`,
                  format: getEsDateFormat(interval),
                },
              },
            },
            {
              unit: {
                terms: {
                  field: 'Roster.unit.keyword',
                },
              },
            },
            {
              reported: {
                terms: {
                  field: 'Muster.reported',
                  missing_bucket: true,
                },
              },
            },
          ],
        },
      },
    },
  };
}

function buildUnitStats(args: {
  aggregations: MusterAggregation,
  unitNames: string[]
  interval: TimeInterval
  intervalCount: number
}) {
  const { aggregations, unitNames, interval, intervalCount } = args;

  // For week intervals, start on Mondays like ES does.
  const momentStartOf = (interval === 'week') ? 'isoWeek' : interval;

  // Initialize unit stats. Use our own set of dates and unit names, since ES may be missing some due to composite
  // aggregations not being able to return empty buckets.
  const unitStats = {} as UnitStatsByDate;
  for (let i = 0; i < intervalCount; i++) {
    const dateStr = moment.utc()
      .subtract(i + 1, interval)
      .startOf(momentStartOf)
      .format(getMomentDateFormat(interval));

    unitStats[dateStr] = {};
    for (const unitName of unitNames) {
      unitStats[dateStr][unitName] = {
        mustersReported: 0,
        mustersNotReported: 0,
        nonMusterPercent: 0,
      };
    }
  }

  // Collect reports and reports missed.
  for (const bucket of aggregations.muster.buckets) {
    const { date, unit, reported } = bucket.key;

    if (unitStats[date][unit] == null) {
      // Unit was in aggregation but not in the sql database, so skip it.
      continue;
    }

    if (reported) {
      unitStats[date][unit].mustersReported = bucket.doc_count;
    } else {
      unitStats[date][unit].mustersNotReported = bucket.doc_count;
    }
  }

  // Calculate non-muster percents.
  for (const date of Object.keys(unitStats)) {
    for (const unit of Object.keys(unitStats[date])) {
      const data = unitStats[date][unit];
      unitStats[date][unit].nonMusterPercent = musterUtils.calcNonMusterPercent(data.mustersReported, data.mustersNotReported);
    }
  }

  return unitStats;
}

type IndividualStats = {
  [edipi: string]: {
    mustersReported: number
    mustersNotReported: number
    nonMusterPercent: number
    unitId?: string
  }
};

type UnitStatsByDate = {
  [date: string]: {
    [unitName: string]: {
      mustersReported: number
      mustersNotReported: number
      nonMusterPercent: number
    }
  }
};

type MusterAggregation = {
  muster: {
    buckets: {
      key: {
        date: string
        unit: string
        reported: boolean
      }
      doc_count: number
    }[]
  }
};

export interface MusterWindow {
  id: string,
  unitId: string,
  unitName: string,
  orgId: number,
  startTimestamp: number,
  endTimestamp: number,
  startTime: string,
  timezone: string,
  durationMinutes: number,
}
