import moment from 'moment-timezone';
import { MusterConfiguration } from '../models/api-response';
import { dayIsIn, DaysOfTheWeek, daysToString, nextDay, oneDaySeconds } from './days';


export type MusterWindow = {
  start: number,
  end: number,
};

export const musterConfigurationToString = (muster: MusterConfiguration) => {
  const today = moment().format('Y-M-D');
  const time = moment.tz(`${today} ${muster.startTime}`, 'Y-M-D h:mm', muster.timezone).format('h:mm A z');
  const duration = muster.durationMinutes / 60;
  return `${daysToString(muster.days)} at ${time} for ${duration} hours`;
};

export const musterConfigurationsToStrings = (musterConfig: MusterConfiguration[] | undefined) => {
  const validation = validateMusterConfiguration(musterConfig);

  if (validation) {
    return [validation];
  }

  if (!musterConfig || musterConfig.length === 0) {
    return ['Units are not required to muster.'];
  }
  return musterConfig.map(muster => musterConfigurationToString(muster));
};

export const validateMusterConfiguration = (musterConfig: MusterConfiguration[] | undefined) => {
  if (!musterConfig || !musterConfig.length) {
    return '';
  }

  if (musterConfig.some(muster => muster.days === DaysOfTheWeek.None)) {
    return 'Please select one or more days.';
  }

  const windows: MusterWindow[] = [];
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
    const firstWindowIndex = windows.length;
    // Loop through each day and add any that are set in this muster configuration
    for (let day = DaysOfTheWeek.Sunday; day <= DaysOfTheWeek.Saturday; day = nextDay(day)) {
      if (dayIsIn(day, muster.days)) {
        windows.push({
          start: current,
          end: current + muster.durationMinutes * 60,
        });
      }
      current += oneDaySeconds;
    }

    // Add the first window of next week to make sure we don't overlap over the week boundary
    windows.push({
      start: windows[firstWindowIndex].start + oneDaySeconds * 7,
      end: windows[firstWindowIndex].end + oneDaySeconds * 7,
    });
  });

  // Sort all muster windows by start time
  windows.sort((a: MusterWindow, b: MusterWindow) => {
    return a.start - b.start;
  });

  // Make sure none overlap
  for (let i = 0; i < windows.length - 1; i++) {
    if (windows[i].end > windows[i + 1].start) {
      return 'Unable to use overlapping muster windows.';
    }
  }

  return '';
};
