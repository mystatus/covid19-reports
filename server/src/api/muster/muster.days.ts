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

export function daysToString(days: DaysOfTheWeek) {
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
