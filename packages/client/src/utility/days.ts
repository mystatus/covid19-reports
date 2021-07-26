export enum DayNamesOfTheWeek {
  None = 0,
  Sunday = 1,
  Monday = 2,
  Tuesday = 3,
  Wednesday = 4,
  Thursday = 5,
  Friday = 6,
  Saturday = 7,
}

// Determine if an input day is in the given set
export function dayIsIn(day: number, set: number[]) {
  return set.includes(day);
}

export function daysToString(days: number[]) {
  const setDays = days.map((day: number) => {
    let dayAbbr = '';
    switch (day) {
      case 1:
        dayAbbr = 'Sun';
        break;
      case 2:
        dayAbbr = 'Mon';
        break;
      case 3:
        dayAbbr = 'Tue';
        break;
      case 4:
        dayAbbr = 'Wed';
        break;
      case 5:
        dayAbbr = 'Thu';
        break;
      case 6:
        dayAbbr = 'Fri';
        break;
      case 7:
        dayAbbr = 'Sat';
        break;
      default:
        break;
    }
    return dayAbbr;
  });

  let dayStr = setDays.join(', ');
  if (dayStr === 'Sun, Mon, Tue, Wed, Thu, Fri, Sat') {
    dayStr = 'Every day';
  } else if (dayStr === 'Mon, Tue, Wed, Thu, Fri') {
    dayStr = 'Every weekday';
  }
  return dayStr;
}

export const oneDaySeconds = 24 * 60 * 60;
