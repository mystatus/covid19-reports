import moment, { Moment } from 'moment-timezone';
import {
  dayIsIn,
  DaysOfTheWeek,
  daysToString,
  nextDay,
  oneDaySeconds,
} from '@covid19-reports/shared';
import { ApiMusterConfiguration } from '../models/api-response';


export type MusterWindow = {
  start: number;
  end: number;
};

export type MusterWindowTyped = MusterWindow & {
  start: number;
  end: number;
  oneTime: boolean;
};

export const musterConfigurationPartsToString = (dateOrDays: string, duration: number, time: string, report: string) => {
  return `[${report}] ${dateOrDays} at ${time} for ${duration} hours`;
};

export const musterConfigurationToString = (muster: ApiMusterConfiguration) => {
  const { dateOrDays, duration, time, report } = musterConfigurationParts(muster);
  return musterConfigurationPartsToString(dateOrDays, duration, time, report);
};

export const musterConfigurationParts = (muster: ApiMusterConfiguration) => {
  const duration = muster.durationMinutes / 60;
  let time: string;
  let dateOrDays: string;
  let when: Moment;

  if (muster.days != null) {
    const today = moment().format('Y-M-D');
    when = moment.tz(`${today} ${muster.startTime}`, 'Y-M-D HH:mm', muster.timezone);
    time = when.format('h:mm A z');
    dateOrDays = daysToString(muster.days);
  } else {
    when = moment.tz(muster.startTime, muster.timezone);
    time = when.format('h:mm A z');
    dateOrDays = when.format('MMM D, YYYY');
  }
  const report = muster.reportSchema.name;

  return {
    dateOrDays,
    duration,
    report,
    time,
    when,
  };
};

export const musterConfigurationsToStrings = (musterConfig: ApiMusterConfiguration[]) => {
  const validation = validateMusterConfiguration(musterConfig);

  if (validation) {
    return [validation];
  }
  if (!musterConfig || musterConfig.length === 0) {
    return ['Units are not required to muster.'];
  }
  return musterConfig.map(muster => musterConfigurationToString(muster));
};

export const validateMusterConfiguration = (musterConfig: ApiMusterConfiguration[]) => {
  if (!musterConfig || !musterConfig.length) {
    return '';
  }

  if (musterConfig.some(muster => muster.days === DaysOfTheWeek.None)) {
    return 'Please select one or more days.';
  }

  const windows: {[key: string]: MusterWindowTyped[]} = {};
  const oneTimeWindows: {[key: string]: MusterWindow[]} = {};

  // Go through each configuration and add the time ranges for muster windows over a test week
  musterConfig.forEach(muster => {
    if (windows[muster.reportSchema.id] == null) {
      windows[muster.reportSchema.id] = [];
    }

    const oneTime = !muster.days;
    let musterDays: DaysOfTheWeek;

    // We will parse the specified startTime according to the type of muster (one-time or repeating)
    let musterTime: Moment;

    if (oneTime) {
      musterTime = moment(muster.startTime);
      // eslint-disable-next-line no-bitwise
      musterDays = (1 << musterTime.day()) as DaysOfTheWeek;
      if (oneTimeWindows[muster.reportSchema.id] == null) {
        oneTimeWindows[muster.reportSchema.id] = [];
      }
      const start = musterTime.unix();
      oneTimeWindows[muster.reportSchema.id].push({
        start,
        end: start + muster.durationMinutes * 60,
      });
    } else {
      musterTime = moment(muster.startTime, 'HH:mm');
      musterDays = muster.days!;
    }

    // Get the unix timestamp of the first possible muster window of the week
    let current = moment()
      .tz(muster.timezone)
      .startOf('week')
      .add(musterTime.hours(), 'hours')
      .add(musterTime.minutes(), 'minutes')
      .unix();

    const firstWindowIndex = windows[muster.reportSchema.id].length;
    // Loop through each day and add any that are set in this muster configuration
    for (let day = DaysOfTheWeek.Sunday; day <= DaysOfTheWeek.Saturday; day = nextDay(day)) {
      if (musterDays !== undefined && dayIsIn(day, musterDays)) {
        windows[muster.reportSchema.id].push({
          start: current,
          end: current + muster.durationMinutes * 60,
          oneTime,
        });
      }
      current += oneDaySeconds;
    }

    // Add the first window of next week to make sure we don't overlap over the week boundary
    windows[muster.reportSchema.id].push({
      start: windows[muster.reportSchema.id][firstWindowIndex].start + oneDaySeconds * 7,
      end: windows[muster.reportSchema.id][firstWindowIndex].end + oneDaySeconds * 7,
      oneTime,
    });
  });
  for (const reportId of Object.keys(windows)) {
    const reportWindows = windows[reportId];
    // Sort all muster windows by start time
    reportWindows.sort((a, b) => a.start - b.start);

    // Make sure none overlap
    const count = reportWindows.length - 1;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j <= count; j++) {
        const a = reportWindows[i];
        const b = reportWindows[j];
        if (a.oneTime && b.oneTime) {
          // Skip overlap validation if we're dealing with two one-time dates.
          // This validation will happen below.
          continue;
        }
        if (a.end > b.start) {
          return 'Unable to use overlapping muster windows.';
        }
      }
    }
  }

  for (const reportId of Object.keys(oneTimeWindows)) {
    const reportWindows = oneTimeWindows[reportId];
    // Sort all muster oneTimeWindows by start time
    reportWindows.sort((a, b) => a.start - b.start);

    // Make sure none of the oneTimeWindows overlap
    const count = reportWindows.length - 1;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j <= count; j++) {
        const a = reportWindows[i];
        const b = reportWindows[j];
        if (a.end > b.start) {
          return 'Unable to use overlapping muster windows.';
        }
      }
    }
  }

  return '';
};
