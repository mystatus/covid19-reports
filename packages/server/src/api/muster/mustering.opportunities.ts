import { MusterConfWithDateArray } from '@covid19-reports/shared';
import moment, { Moment } from 'moment-timezone';
// @ts-ignore
import later from '@breejs/later';
import { getUnitMusterConfiguration, UnitMusterConf } from './muster.configuration';

/**
 * The <strong><code>getMusteringOpportunities()</code></strong> function <strong> returns mustering opportunities,
 * time windows for each day when mustering is required</strong>.
 *
 * @param orgId The organization ID for which the mustering opportunities are returned
 * @param unitIds The list of unit IDs for which the mustering opportunities are returned
 * @param startDate The start date for the generation of time muster opportunities
 * @param endDate The end date for the generation of time muster opportunities
 */
export async function getMusteringOpportunities(orgId: number, unitIds: number[], startDate: moment.Moment, endDate: moment.Moment)
  : Promise<MusteringOpportunities> {
  const unitsMusterConf = await getUnitMusterConfiguration(orgId, unitIds);
  return toMusterOpportunitiesWithUnits(unitsMusterConf, startDate, endDate);
}

/**
 * The <strong><code>toMusterOpportunitiesWithUnits()</code></strong> function <strong>returns a structure of mustering
 * opportunities for every unit in the muster configuration time limited by start and end dates</strong>.
 *
 * Example of the structure for two units, A and B:
 * <pre>
 * {
 *      unitIdA: [{startMusterDate: Moment, endMusterDate: Moment},
 *                {startMusterDate: Moment, endMusterDate: Moment}],
 *      unitIdB: [{startMusterDate: Moment, endMusterDate: Moment}],
 *    }
 * </pre>
 *
 * @param unitMusterConf The units with their muster configuration
 * @param startDate The start date for the generation of time muster opportunities
 * @param endDate The end date for the generation of time muster opportunities
 *
 */
export function toMusterOpportunitiesWithUnits(unitMusterConf: UnitMusterConf[], startDate: any, endDate: any): MusteringOpportunities {

  const rsp: MusteringOpportunities = {};

  unitMusterConf.forEach(singleUntilConfigurations => {
    const musterTimeView = singleUntilConfigurations.musterConf.map(suc => {
      return toMusterOpportunities(suc, startDate, endDate);
    });
    rsp[singleUntilConfigurations.unitId] = musterTimeView.flat(1);
  });
  return rsp;
}

/**
 * The <strong><code>toMusterOpportunities()</code></strong> function <strong>returns an array of
 * muster opportunities for the given muster configuration time limited by start and end dates.
 *
 * An example of a single muster configuration:
 *
 * <pre>
 * {
 *    days: [2, 3],
 *     startTime: '13:00',
 *     timezone: 'America/Chicago',
 *     durationMinutes: 60,
 *     reportId: 'es6ddssymptomobs',
 *   };
 *  </pre>
 *
 * An example of an output:
 * <pre>
 *  [
 *  {
 *   startMusterDate: Moment<2021-07-05T18:00:00Z>,
 *   endMusterDate: Moment<2021-07-05T19:00:00Z>
 * },
 *  {
 *   startMusterDate: Moment<2021-07-12T18:00:00Z>,
 *   endMusterDate: Moment<2021-07-12T19:00:00Z>
 * },
 *  {
 *   startMusterDate: Moment<2021-07-19T18:00:00Z>,
 *   endMusterDate: Moment<2021-07-19T19:00:00Z>
 * },
 *  {
 *   startMusterDate: Moment<2021-07-26T18:00:00Z>,
 *   endMusterDate: Moment<2021-07-26T19:00:00Z>
 * },
 *  {
 *   startMusterDate: Moment<2021-07-06T18:00:00Z>,
 *   endMusterDate: Moment<2021-07-06T19:00:00Z>
 * },
 *  {
 *   startMusterDate: Moment<2021-07-13T18:00:00Z>,
 *   endMusterDate: Moment<2021-07-13T19:00:00Z>
 * },
 *  {
 *   startMusterDate: Moment<2021-07-20T18:00:00Z>,
 *   endMusterDate: Moment<2021-07-20T19:00:00Z>
 * },
 *  {
 *   startMusterDate: Moment<2021-07-27T18:00:00Z>,
 *   endMusterDate: Moment<2021-07-27T19:00:00Z>
 * }
 *  ]
 *
 * </pre>
 *
 * @param musterConf The muster configuration
 * @param startDate The start date for the generation of time muster opportunities
 * @param endDate The end date for the generation of time muster opportunities
 */
export function toMusterOpportunities(musterConf: MusterConfWithDateArray, startDate: moment.Moment, endDate: moment.Moment)
  : MusterWindowWithStartAndEndDate[] {

  const {days, startTime, timezone, durationMinutes} = musterConf;
  const startDatesMusterSchedules = getMusterStartDatesSchedules(startTime, timezone, days, startDate, endDate);
  return toMusterWindows(startDatesMusterSchedules, durationMinutes);
}

/**
 * The <strong><code>getMusterStartDatesSchedules()</code></strong> function <strong>generates an array of UTC dates and times
 * as a periodic schedule calculated using a given time, timezone, and days of the week</strong>. The generated dates and times are limited
 * by start and end date.
 *
 * @param timeString The string representation of time
 * @param timezone The timezone associated with <code><strong>timeString</strong></code>
 * @param days The array representation of days in a week. For example [1,3] represents Sunday and Tuesday.
 * @param startDate The start date to limit the generated dates
 * @param endDate The end date to limit the generated dates
 */
function getMusterStartDatesSchedules(timeString: string, timezone: string, days: number[], startDate: moment.Moment, endDate: moment.Moment) {
  const hoursMinutes = toHoursAndMinutes(timeString, timezone);
  const startDaysSchedule = days.map(day => {
    return later.parse.recur()
      .on(day)
      .dayOfWeek()
      .on(parseInt(hoursMinutes.hours))
      .hour()
      .on(parseInt(hoursMinutes.minutes))
      .minute();
  });
  return startDaysSchedule.map(sch => {
    // 10000 is number of instances to return. It is large enough to return all instances we need
    const allSchedules = later.schedule(sch).next(10000, startDate.toDate(), endDate.toDate());
    // @ts-ignore next() does return zero value when no schedule is found for the given date range
    if (allSchedules === 0) {
      return [];
    }
    // next() is weird, it returns an non-array object when only one schedule is returned
    if (!Array.isArray(allSchedules)) {
      return [allSchedules];
    }
    return allSchedules;
  });
}

/**
 * The <strong><code>toHoursAndMinutes()</code></strong> function <strong>returns hours and minutes in UTC extracted from
 * a string representation of a time considering the associated timezone</strong>.
 *
 * @param timeString The string representation of a date and time
 * @param timezone The timezone associated with <code><strong>timeString</strong></code>
 */
function toHoursAndMinutes(timeString: string, timezone: string): HoursAndMinutes {
  const split = moment.tz(timeString, 'HH:mm', timezone)
    .utc()
    .format('HH:mm')
    .split(':');
  return {hours: split[0], minutes: split[1]};
}

/**
 * The <strong><code>toMusterWindows()</code></strong> function <strong>adds the end of the muster window
 * for each start of the muster window and returns and array of muster windows with both the start and end dates</strong>.
 * The end of the muster window is calculated by adding duration to the start of the muster window.
 *
 *
 * @param musterStartTimes The start of the muster window
 * @param durationMinutes The duration of the muster window
 */
export function toMusterWindows(musterStartTimes: Date[][], durationMinutes: number): MusterWindowWithStartAndEndDate[] {

  const musterTimeView: MusterWindowWithStartAndEndDate[] = [];

  musterStartTimes.forEach(dateArray => {
    dateArray.forEach((dateElement: Date) => {
      musterTimeView.push({
        startMusterDate: moment.utc(dateElement),
        endMusterDate: moment.utc(dateElement).add({minutes: durationMinutes}),
      });
    });
  });

  return musterTimeView;
}

type HoursAndMinutes = {
  hours: string
  minutes: string
};

export type MusterWindowWithStartAndEndDate = {
  startMusterDate: Moment
  endMusterDate: Moment
};

export type MusteringOpportunities = {
  [unitId: number]: MusterWindowWithStartAndEndDate[]
};

