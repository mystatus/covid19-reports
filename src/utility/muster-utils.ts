import moment from 'moment-timezone';
import { ApiReportSchema, MusterConfiguration } from '../models/api-response';
import { dayIsIn, DaysOfTheWeek, daysToString, nextDay, oneDaySeconds } from './days';


export type MusterWindow = {
  start: number,
  end: number,
};

export const musterConfigurationToString = (muster: MusterConfiguration, reports: ApiReportSchema[]) => {
  const report = reports.find(r => r.id === muster.reportId);
  if (!report) {
    return null;
  }
  const today = moment().format('Y-M-D');
  const time = moment.tz(`${today} ${muster.startTime}`, 'Y-M-D h:mm', muster.timezone).format('h:mm A z');
  const duration = muster.durationMinutes / 60;
  return `[${report.name}] ${daysToString(muster.days)} at ${time} for ${duration} hours`;
};

export const musterConfigurationsToStrings = (musterConfig: MusterConfiguration[] | undefined, reports: ApiReportSchema[]) => {
  const validation = validateMusterConfiguration(musterConfig);

  if (validation) {
    return [validation];
  }

  if (!musterConfig || musterConfig.length === 0) {
    return ['Units are not required to muster.'];
  }
  return musterConfig.map(muster => musterConfigurationToString(muster, reports)).filter((m: string | null): m is string => {
    return typeof m != null;
  });
};

export const validateMusterConfiguration = (musterConfig: MusterConfiguration[] | undefined) => {
  if (!musterConfig || !musterConfig.length) {
    return '';
  }

  if (musterConfig.some(muster => muster.days === DaysOfTheWeek.None)) {
    return 'Please select one or more days.';
  }

  const windows: {[key: string]: MusterWindow[]} = {};
  // Go through each configuration and add the time ranges for muster windows over a test week
  musterConfig.forEach(muster => {
    // Parse the start time
    const musterTime = moment(muster.startTime, 'HH:mm');
    // Get the unix timestamp of the first possible muster window of the week
    let current = moment()
      .tz(muster.timezone)
      .startOf('week')
      .add(musterTime.hours(), 'hours')
      .add(musterTime.minutes(), 'minutes')
      .unix();
    if (windows[muster.reportId] == null) {
      windows[muster.reportId] = [];
    }
    const firstWindowIndex = windows[muster.reportId].length;
    // Loop through each day and add any that are set in this muster configuration
    for (let day = DaysOfTheWeek.Sunday; day <= DaysOfTheWeek.Saturday; day = nextDay(day)) {
      if (dayIsIn(day, muster.days)) {
        windows[muster.reportId].push({
          start: current,
          end: current + muster.durationMinutes * 60,
        });
      }
      current += oneDaySeconds;
    }

    // Add the first window of next week to make sure we don't overlap over the week boundary
    windows[muster.reportId].push({
      start: windows[muster.reportId][firstWindowIndex].start + oneDaySeconds * 7,
      end: windows[muster.reportId][firstWindowIndex].end + oneDaySeconds * 7,
    });
  });

  // Sort all muster windows by start time
  let errorMessage: string = '';
  Object.keys(windows).forEach(reportId => {
    const reportWindows = windows[reportId];
    reportWindows.sort((a: MusterWindow, b: MusterWindow) => {
      return a.start - b.start;
    });

    // Make sure none overlap
    for (let i = 0; i < reportWindows.length - 1; i++) {
      if (reportWindows[i].end > reportWindows[i + 1].start) {
        errorMessage = 'Unable to use overlapping muster windows.';
        break;
      }
    }
  });

  return errorMessage;
};
