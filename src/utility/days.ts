export enum DaysOfTheWeek {
  None = 0,
  Sunday = 1,
  Monday = 2,
  Tuesday = 4,
  Wednesday = 8,
  Thursday = 16,
  Friday = 32,
  Saturday = 64,
}

export function nextDay(day: DaysOfTheWeek) {
  // eslint-disable-next-line no-bitwise
  return day << 1;
}

// Determine if an input day is in the given set
export function dayIsIn(day: DaysOfTheWeek, set: DaysOfTheWeek) {
  // eslint-disable-next-line no-bitwise
  return (set & day) === day;
}

export function daysToString(days: DaysOfTheWeek) {
  const setDays: string[] = [];
  /* eslint-disable no-bitwise */
  if (days & DaysOfTheWeek.Sunday) {
    setDays.push('Sun');
  }
  if (days & DaysOfTheWeek.Monday) {
    setDays.push('Mon');
  }
  if (days & DaysOfTheWeek.Tuesday) {
    setDays.push('Tue');
  }
  if (days & DaysOfTheWeek.Wednesday) {
    setDays.push('Wed');
  }
  if (days & DaysOfTheWeek.Thursday) {
    setDays.push('Thu');
  }
  if (days & DaysOfTheWeek.Friday) {
    setDays.push('Fri');
  }
  if (days & DaysOfTheWeek.Saturday) {
    setDays.push('Sat');
  }
  /* eslint-enable no-bitwise */
  let dayStr = setDays.join(', ');
  if (dayStr === 'Sun, Mon, Tue, Wed, Thu, Fri, Sat') {
    dayStr = 'Every day';
  } else if (dayStr === 'Mon, Tue, Wed, Thu, Fri') {
    dayStr = 'Every weekday';
  }
  return dayStr;
}

export const oneDaySeconds = 24 * 60 * 60;
