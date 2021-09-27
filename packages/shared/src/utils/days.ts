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

// Convert a moment day (i.e. moment.getDay()) to a day bit
export function getDayBitFromMomentDay(momentDay: number) {
  // eslint-disable-next-line no-bitwise
  return 1 << momentDay;
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

/**
 * The <strong><code>daysToDateList</code></strong> function <strong>converts dates in the binary form
 * to an array of dates</strong>.
 * The first day of the week, Sunday is represented by <code>[1]</code>.
 * For example the number <code>3</code> binary date is return as <code>[1,2]</code>.
 *
 * @param days The binary form of days
 */
export function binaryDaysToDateArray(days: number | null): number[] {
  if (!days) {
    return [];
  }
  const setDays: number[] = [];
  /* eslint-disable no-bitwise */
  if (days & DaysOfTheWeek.Sunday) {
    setDays.push(1);
  }
  if (days & DaysOfTheWeek.Monday) {
    setDays.push(2);
  }
  if (days & DaysOfTheWeek.Tuesday) {
    setDays.push(3);
  }
  if (days & DaysOfTheWeek.Wednesday) {
    setDays.push(4);
  }
  if (days & DaysOfTheWeek.Thursday) {
    setDays.push(5);
  }
  if (days & DaysOfTheWeek.Friday) {
    setDays.push(6);
  }
  if (days & DaysOfTheWeek.Saturday) {
    setDays.push(7);
  }
  /* eslint-enable no-bitwise */
  return setDays;
}

export const oneDayMilliseconds = 24 * 60 * 60 * 1000;
