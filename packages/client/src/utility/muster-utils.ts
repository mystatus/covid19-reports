import moment, { Moment } from 'moment-timezone';
import { ApiReportSchema, MusterConfiguration } from '../models/api-response';
import { dayIsIn, DayNamesOfTheWeek, daysToString, oneDaySeconds } from './days';


export type MusterWindow = {
  start: number,
  end: number,
};

export type MusterWindowTyped = MusterWindow & {
  start: number,
  end: number,
  oneTime: boolean,
};

export const mustersConfigurationsAreEqual = (left?: MusterConfiguration[], right?: MusterConfiguration[]) => {
  return left && right
    && left.length === right.length
    && left.every((l, index) => {
      const r = right[index];
      return l.days === r.days
        && l.startTime === r.startTime
        && l.timezone === r.timezone
        && l.durationMinutes === r.durationMinutes
        && l.reportId === r.reportId;
    });
};

export const musterConfigurationPartsToString = (dateOrDays: string, duration: number, time: string, report: string) => {
  return `[${report}] ${dateOrDays} at ${time} for ${duration} hours`;
};

export const musterConfigurationToString = (muster: MusterConfiguration, reports: ApiReportSchema[]) => {
  const { dateOrDays, duration, time, report } = musterConfigurationParts(muster, reports);
  return musterConfigurationPartsToString(dateOrDays, duration, time, report);
};

export const musterConfigurationParts = (muster: MusterConfiguration, reports: ApiReportSchema[]) => {
  const duration = muster.durationMinutes / 60;
  let time: string;
  let dateOrDays: string;
  let when: Moment;

  if (muster.days !== undefined) {
    const today = moment().format('Y-M-D');
    when = moment.tz(`${today} ${muster.startTime}`, 'Y-M-D HH:mm', muster.timezone);
    time = when.format('h:mm A z');
    dateOrDays = daysToString(muster.days);
  } else {
    when = moment.tz(muster.startTime, muster.timezone);
    time = when.format('h:mm A z');
    dateOrDays = when.format('MMM D, YYYY');
  }
  const report = reports.find(r => r.id === muster.reportId)?.name ?? 'Unknown Report';

  return {
    dateOrDays,
    duration,
    report,
    time,
    when,
  };
};

export const musterConfigurationsToStrings = (musterConfig: MusterConfiguration[], reports: ApiReportSchema[]) => {
  const validation = validateMusterConfiguration(musterConfig);

  if (validation) {
    return [validation];
  }
  if (!musterConfig || musterConfig.length === 0) {
    return ['Units are not required to muster.'];
  }
  return musterConfig.map(muster => musterConfigurationToString(muster, reports));
};

export const validateMusterConfiguration = (musterConfig: MusterConfiguration[]) => {
  if (!musterConfig || !musterConfig.length) {
    return '';
  }

  if (musterConfig.some(muster => muster.days && !muster.days.length)) {
    return 'Please select one or more days.';
  }

  const windows: { [key: string]: MusterWindowTyped[] } = {};
  const oneTimeWindows: { [key: string]: MusterWindow[] } = {};

  // Go through each configuration and add the time ranges for muster windows over a test week
  musterConfig.forEach(muster => {
    if (windows[muster.reportId] == null) {
      windows[muster.reportId] = [];
    }

    const oneTime = !muster.days;
    let musterDays: number[];

    // We will parse the specified startTime according to the type of muster (one-time or repeating)
    let musterTime: Moment;

    if (oneTime) {
      musterTime = moment(muster.startTime);
      musterDays = [musterTime.day() + 1];

      if (oneTimeWindows[muster.reportId] == null) {
        oneTimeWindows[muster.reportId] = [];
      }
      const start = musterTime.unix();
      oneTimeWindows[muster.reportId].push({
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

    const firstWindowIndex = windows[muster.reportId].length;
    // Loop through each day and add any that are set in this muster configuration
    for (let day = DayNamesOfTheWeek.Sunday; day <= DayNamesOfTheWeek.Saturday; day++) {
      if (musterDays !== undefined && dayIsIn(day, musterDays)) {
        windows[muster.reportId].push({
          start: current,
          end: current + muster.durationMinutes * 60,
          oneTime,
        });
      }
      current += oneDaySeconds;
    }

    // Add the first window of next week to make sure we don't overlap over the week boundary
    windows[muster.reportId].push({
      start: windows[muster.reportId][firstWindowIndex].start + oneDaySeconds * 7,
      end: windows[muster.reportId][firstWindowIndex].end + oneDaySeconds * 7,
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
