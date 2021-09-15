// @ts-ignore
import later from '@breejs/later';
import { MSearchResponse } from 'elasticsearch';
import moment, { Moment } from 'moment-timezone';
import {
  binaryDaysToDateArray,
  formatPhoneNumber,
} from '@covid19-reports/shared';
import { Org } from '../api/org/org.model';
import { UserRole } from '../api/user/user-role.model';
import { Roster } from '../api/roster/roster.model';
import { MusterConfiguration } from '../api/muster/muster-config.model';
import { elasticsearch } from '../elasticsearch/elasticsearch';
import { buildEsIndexPatternsForMuster } from './elasticsearch-utils';
import { InternalServerError } from './error-types';
import { Log } from './log';
import {
  getElasticsearchDateFormat,
  getElasticsearchTimeInterval,
  getMomentDateFormat,
  TimeInterval,
} from './util';
import { diffEpsilon } from './math-utils';
import { RosterEntry } from './roster-utils';

/**
 * Get muster stats for each individual on the roster, given a time range and optional unit to filter by. The returned
 * data will include each individual's muster stats merged with their roster data.
 */
export async function getMusterRosterStats(args: {
  org: Org;
  userRole: UserRole;
  unitId?: number;
  fromDate: Moment;
  toDate: Moment;
}) {
  const { org, userRole, unitId, fromDate, toDate } = args;

  // Send ES request.
  const index = buildEsIndexPatternsForMuster(userRole, unitId);
  const body = [
    { index },
    buildMusterRosterBody({
      fromDate,
      toDate,
    }),

    { index },
    buildRosterPhoneNumberBody(),
  ];

  let response: MSearchResponse<never>;
  try {
    response = await elasticsearch.msearch({ body });
  } catch (err) {
    Log.error(err);
    throw new InternalServerError(`Elasticsearch: ${err.message}`);
  }

  const musterAggsResponse = response.responses![0];
  const phoneNumbersResponse = response.responses![1] as {
    hits: {
      hits: Array<{
        _source: {
          EDIPI: string;
          Timestamp: number;
          Details: {
            PhoneNumber: string;
          };
        };
      }>;
    };
  };

  const edipiToPhone: { [edipi: string]: string } = {};
  for (const doc of phoneNumbersResponse.hits.hits) {
    const edipi = doc._source.EDIPI;
    if (edipiToPhone[edipi] == null) {
      edipiToPhone[edipi] = doc._source.Details.PhoneNumber;
    }
  }

  // Get allowed roster data for the individuals returned from ES.
  let rosterEntries: Roster[];
  if (unitId) {
    rosterEntries = await Roster.createQueryBuilder('roster')
      .leftJoinAndSelect('roster.unit', 'unit')
      .leftJoinAndSelect('unit.org', 'org')
      .where('unit.id = :unitId', { unitId })
      .getMany();
  } else {
    rosterEntries = await Roster.createQueryBuilder('roster')
      .leftJoinAndSelect('roster.unit', 'unit')
      .leftJoinAndSelect('unit.org', 'org')
      .where('org.id = :orgId', { orgId: org.id })
      .getMany();
  }

  const rosterStats: MusterRosterStats = {};

  const rosterEntriesByEdipi: { [edipi: string]: Roster } = {};
  rosterEntries.forEach(entry => {
    const { edipi } = entry;

    rosterEntriesByEdipi[edipi] = entry;

    if (!rosterStats[edipi]) {
      rosterStats[edipi] = {
        totalMusters: 0,
        mustersReported: 0,
        musterPercent: 0,
      };
    }

    // Fill in any missing phone numbers that weren't in ES.
    // HACK: Just try to find any custom column with "phone" in its name. Maybe we need a special type
    // for phone number, or need to make it a non-custom column...
    const phoneKey = Object.keys(entry.customColumns)
      .find(key => key.toLowerCase().indexOf('phone') !== -1);

    if (phoneKey && edipiToPhone[entry.edipi] == null) {
      edipiToPhone[entry.edipi] = entry.customColumns[phoneKey] as string;
    }
  });

  const allowedRosterColumns = Roster.filterAllowedColumns(await Roster.getColumns(org), userRole.role);

  // Collect reports and reports missed.
  const aggs = musterAggsResponse.aggregations as MusterRosterAggregations | undefined;
  const buckets = aggs?.muster.buckets ?? [];
  for (const bucket of buckets) {
    const { edipi, reported } = bucket.key;

    if (!rosterStats[edipi]) {
      rosterStats[edipi] = {
        totalMusters: 0,
        mustersReported: 0,
        musterPercent: 0,
      };
    }

    rosterStats[edipi].totalMusters += bucket.doc_count;

    if (reported) {
      rosterStats[edipi].mustersReported = bucket.doc_count;
    }
  }

  // Calculate muster percents.
  for (const stats of Object.values(rosterStats)) {
    stats.musterPercent = calcMusterPercent(stats.totalMusters, stats.mustersReported);
  }

  // Return a sorted array of the individuals' stats merged with their roster data.
  return Object.keys(rosterStats)
    .filter(edipi => {
      return (rosterEntriesByEdipi[edipi] != null);
    })
    .sort((edipiA, edipiB) => {
      const entryA = rosterEntriesByEdipi[edipiA];
      const entryB = rosterEntriesByEdipi[edipiB];
      const individualA = rosterStats[edipiA];
      const individualB = rosterStats[edipiB];

      let diff = diffEpsilon(individualA.musterPercent, individualB.musterPercent);
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
      const individual = rosterStats[edipi];
      for (const columnInfo of allowedRosterColumns) {
        const columnValue = rosterEntry.getColumnValue(columnInfo);
        Reflect.set(rosterEntryCleaned, columnInfo.name, columnValue);
      }
      const phone = edipiToPhone[edipi];
      return {
        ...individual,
        ...rosterEntryCleaned,
        unitId: rosterEntry.unit.id,
        phone: (phone) ? formatPhoneNumber(phone) : undefined,
      } as MusterRosterStats[string] & Partial<Roster>;
    });
}

/**
 * Get aggregated unit muster stats over the given weeks/months.
 */
export async function getMusterUnitTrends(args: {
  userRole: UserRole;
  currentDate: Moment;
  weeksCount: number;
  monthsCount: number;
}) {
  const { userRole, currentDate, weeksCount, monthsCount } = args;

  const unitNames = (await userRole.getUnits()).map(u => u.name);

  // For week intervals, use the iso week range (Monday - Sunday) like ES does.
  // Also make sure dates are in utc so that startOf/endOf match ES.
  const fromDateWeek = moment.utc(currentDate)
    .subtract(weeksCount, 'weeks')
    .startOf('isoWeek');

  const toDateWeek = moment.utc(currentDate)
    .subtract(1, 'week')
    .endOf('isoWeek');

  const fromDateMonth = moment.utc(currentDate)
    .subtract(monthsCount, 'months')
    .startOf('month');

  const toDateMonth = moment.utc(currentDate)
    .subtract(1, 'month')
    .endOf('month');

  //
  // Build elasticsearch multisearch queries.
  //
  const index = buildEsIndexPatternsForMuster(userRole);
  const esBody = [
    { index },
    buildMusterUnitsEsBody({
      interval: 'week',
      fromDate: fromDateWeek,
      toDate: toDateWeek,
    }),

    { index },
    buildMusterUnitsEsBody({
      interval: 'month',
      fromDate: fromDateMonth,
      toDate: toDateMonth,
    }),
  ] as any[];

  // Send ES request.
  let response: MSearchResponse<unknown>;
  try {
    response = await elasticsearch.msearch({ body: esBody });
  } catch (err) {
    Log.error(err);
    throw new InternalServerError(`Elasticsearch: ${err.message}`);
  }

  //
  // Organize and return data.
  //
  const weeklyAggs = response.responses![0].aggregations as MusterUnitAggregation | undefined;
  const monthlyAggs = response.responses![1].aggregations as MusterUnitAggregation | undefined;

  return {
    weekly: buildUnitStats({
      aggregations: weeklyAggs,
      unitNames,
      interval: 'week',
      intervalCount: weeksCount,
      fromDate: fromDateWeek,
    }),
    monthly: buildUnitStats({
      aggregations: monthlyAggs,
      unitNames,
      interval: 'month',
      intervalCount: monthsCount,
      fromDate: fromDateMonth,
    }),
  };
}

export function calcMusterPercent(totalMusters: number, mustersReported: number) {
  if (totalMusters === 0) {
    return 100;
  }

  const musterPercent = (mustersReported / totalMusters) * 100;

  if (musterPercent < 0 || musterPercent > 100) {
    Log.warn(`Invalid muster percent (${musterPercent}). It should be between 0 and 100.`);
  }

  return musterPercent;
}

export function getOneTimeMusterWindowTime(muster: MusterConfiguration) {
  return moment(muster.startTime).tz(muster.timezone).unix();
}

export function getEarliestMusterWindowTime(muster: MusterConfiguration, referenceTime: number) {
  const musterTime = moment(muster.startTime, 'HH:mm');
  return moment
    .unix(referenceTime)
    .tz(muster.timezone)
    .startOf('week')
    .add(musterTime.hour(), 'hours')
    .add(musterTime.minutes(), 'minutes')
    .unix();
}

export function buildMusterWindow(startTimestamp: number, endTimestamp: number, muster: MusterConfiguration, org: Org): MusterWindow {
  return {
    id: `${org.id}-${muster.id}-${moment.unix(startTimestamp).utc().format('Y-M-D-HH-mm')}-${muster.reportSchema!.id}`,
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

export function getDistanceToWindow(start: number, end: number, time: number) {
  if (time > end) {
    return time - end;
  }
  if (time < start) {
    return time - start;
  }
  return 0;
}

function buildRosterPhoneNumberBody() {
  return {
    size: 10000,
    _source: ['EDIPI', 'Timestamp', 'Details.PhoneNumber'],
    query: {
      exists: {
        field: 'Details.PhoneNumber',
      },
    },
    sort: {
      Timestamp: 'desc',
    },
  };
}

function buildMusterRosterBody(args: {
  fromDate: Moment;
  toDate: Moment;
}) {
  const { fromDate, toDate } = args;

  /*
    Example ES Response:
    {
      ...
      "aggregations": {
        "muster": {
          "after_key": {
            "edipi": "0000000001",
            "reported": false
          },
          "buckets": [
            {
              "key": {
                "edipi": "0000000001",
                "reported": false
              },
              "doc_count": 1
            },
            {
              "key": {
                "edipi": "0000000001",
                "reported": true
              },
              "doc_count": 4
            },
            ...
          ]
        }
      }
    }
  */

  return {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              'Muster.startTimestamp': {
                gte: fromDate.valueOf(),
                lte: toDate.valueOf(),
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
                  missing_bucket: true, // Prevent the request from failing if there are docs without Muster.reported.
                },
              },
            },
          ],
        },
      },
    },
  };
}

function buildMusterUnitsEsBody(args: {
  fromDate: Moment;
  toDate: Moment;
  interval: TimeInterval;
}) {
  const { fromDate, toDate, interval } = args;

  /*
    Example ES Response:
    {
      ...
      "aggregations": {
        "muster": {
          "after_key": {
            "unit": "Steel Rain",
            "date": "2021-01-18",
            "reported": true
          },
          "buckets": [
            {
              "key": {
                "unit": "Airhawk",
                "date": "2020-12-28",
                "reported": false
              },
              "doc_count": 84
            },
            {
              "key": {
                "unit": "Airhawk",
                "date": "2020-12-28",
                "reported": true
              },
              "doc_count": 152
            },
            ...
          ]
        }
      }
    }
  */

  const esInterval = getElasticsearchTimeInterval(interval);

  return {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              'Muster.startTimestamp': {
                gte: fromDate.valueOf(),
                lte: toDate.valueOf(),
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
                  field: 'Muster.startTimestamp',
                  interval: `1${esInterval}`,
                  format: getElasticsearchDateFormat(interval),
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
                  missing_bucket: true, // Prevent the request from failing if there are docs without Muster.reported.
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
  aggregations: MusterUnitAggregation | undefined;
  unitNames: string[];
  interval: TimeInterval;
  intervalCount: number;
  fromDate: Moment;
}) {
  const { aggregations, unitNames, interval, intervalCount, fromDate } = args;

  // Initialize unit stats. Use our own set of dates and unit names, since ES may be missing some due to composite
  // aggregations not being able to return empty buckets.
  const unitStats = {} as MusterUnitStatsByDate;
  for (let i = 0; i < intervalCount; i++) {
    const dateStr = moment.utc(fromDate)
      .add(i, interval)
      .format(getMomentDateFormat(interval));

    unitStats[dateStr] = {};
    for (const unitName of unitNames) {
      unitStats[dateStr][unitName] = {
        totalMusters: 0,
        mustersReported: 0,
        musterPercent: 0,
      };
    }
  }

  // Collect reports and reports missed.
  const buckets = aggregations?.muster.buckets ?? [];
  for (const bucket of buckets) {
    const { date, unit, reported } = bucket.key;

    if (unitStats[date][unit] == null) {
      // Unit was in aggregation but not in the sql database, so skip it.
      continue;
    }

    unitStats[date][unit].totalMusters += bucket.doc_count;

    if (reported) {
      unitStats[date][unit].mustersReported = bucket.doc_count;
    }
  }

  // Calculate muster percents.
  for (const date of Object.keys(unitStats)) {
    for (const unit of Object.keys(unitStats[date])) {
      const data = unitStats[date][unit];
      unitStats[date][unit].musterPercent = calcMusterPercent(data.totalMusters, data.mustersReported);
    }
  }

  return unitStats;
}

/**
 * Converts the information from a muster config to a later.js schedule
 * @param timezone timezone of the schedule startTime
 * @param days array of numbers in the range 1-7
 * @param startTime schedule start time
 * @param durationMinutes how long the muster event window lasts for
 */
export function getMusterSchedule(timezone: string, days: number[] | undefined, startTime: string, durationMinutes: number): later.Schedule {
  // handle recurring muster schedule
  if (days && days.length > 0) {
    const start = moment.tz(startTime, 'HH:mm', timezone)
      .utc()
      .format('HH:mm');
    const end = moment.tz(startTime, 'HH:mm', timezone)
      .add(durationMinutes, 'minutes')
      .utc()
      .format('HH:mm');

    return later.schedule(later.parse.recur()
      .on(days)
      .dayOfWeek()
      .after(start)
      .time()
      .before(end)
      .time());
  }

  // handle one-time muster schedule
  const start = moment.tz(startTime, 'YYYY-MM-DDTHH:mm:ss', timezone).utc();
  const end = moment.tz(startTime, 'YYYY-MM-DDTHH:mm:ss', timezone)
    .add(durationMinutes, 'minutes')
    .utc()
    .format('HH:mm');

  return later.schedule(later.parse.recur()
    .on(start.year())
    .year()
    .on(start.dayOfYear())
    .dayOfYear()
    .after(start.format('HH:mm'))
    .time()
    .before(end)
    .time());
}

/**
 * Gets the total required number of musters for a unit based on all configs for the unit
 * over a given period of time.
 * @param unitConfigs an array of config objects to check the count for the unit
 * @param fromDate start of date range to get muster count for
 * @param toDate cutoff for date range to get muster count for
 */
export function getUnitRequiredMusterCount(unitConfigs: MusterConfiguration[] | undefined, fromDate: moment.Moment, toDate: moment.Moment): number {
  let totalMustersRequired = 0;
  unitConfigs?.forEach((config: any) => {
    const sched = getMusterSchedule(config.timezone, binaryDaysToDateArray(config.days), config.startTime, config.durationMinutes);
    // the parameter order below may seem unintuitive but moment.prev() requires startTime to be greater than endTime
    const schedRange = sched.prevRange(10000, toDate.toDate(), fromDate.toDate());
    if (schedRange) {
      totalMustersRequired += schedRange.length;
    }
  });
  return totalMustersRequired;
}

/**
 * Returns the number of compliant musters/observations for a given set of configs
 * @param userObservations an array of {reportSchema, timestamp} objects for a single user
 * @param unitConfigs an array of muster configurations for a single unit
 */
export function getCompliantUserObserverationCount(
  userObservations: { report_schema_id: string; timestamp: Date }[],
  unitConfigs: MusterConfiguration[] | undefined,
): number {
  let complianceCount = 0;
  if (userObservations) {
    userObservations.forEach(userObs => {
      // for each observation find out which config it should be related to
      const config: MusterConfiguration | undefined = unitConfigs?.find((c: MusterConfiguration) => c.reportSchema!.id === userObs.report_schema_id);

      // if a matching configuration is found then generate the schedule for it and see if the
      // observation timestamp is valid
      if (config) {
        const sched = getMusterSchedule(config.timezone, binaryDaysToDateArray(config.days), config.startTime, config.durationMinutes);
        if (sched.isValid(userObs.timestamp)) {
          complianceCount += 1;
        }
      }
    });
  }
  return complianceCount;
}

/**
 * Represents muster compliance for an individual
 */
export type MusterCompliance = {
  totalMusters: number;
  mustersReported: number;
  musterPercent: number;
} & RosterEntry;

type MusterRosterAggregations = {
  muster: {
    buckets: Array<{
      key: {
        edipi: string;
        reported: boolean;
      };
      doc_count: number;
    }>;
  };
};

type MusterRosterStats = {
  [edipi: string]: {
    totalMusters: number;
    mustersReported: number;
    musterPercent: number;
    unitId?: number;
  };
};

type MusterUnitStatsByDate = {
  [date: string]: {
    [unitName: string]: {
      totalMusters: number;
      mustersReported: number;
      musterPercent: number;
    };
  };
};

type MusterUnitAggregation = {
  muster: {
    buckets: Array<{
      key: {
        date: string;
        unit: string;
        reported: boolean;
      };
      doc_count: number;
    }>;
  };
};

export interface MusterWindow {
  id: string;
  reportingGroup?: string;
  orgId: number;
  startTimestamp: number;
  endTimestamp: number;
  startTime: string;
  timezone: string;
  durationMinutes: number;
  reportId: string;
}
