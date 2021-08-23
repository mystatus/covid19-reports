import moment from 'moment-timezone';
import { expect } from 'chai';
import { binaryDaysToDateArray } from '@covid19-reports/shared';
import { getCompliantUserObserverationCount, getUnitRequiredMusterCount, getMusterSchedule } from './muster-utils';


describe(`Muster Utils`, () => {
  const configs = [{
    // every weekday at mindnight west coast time until 2 hours later
    days: 62,
    startTime: '00:00',
    timezone: 'America/Los_Angeles',
    durationMinutes: 120,
    reportId: 'report1',
  }, {
    // one-time on 2020-01-02 at 2AM west coast time until 2 hours later
    startTime: '2020-01-02T02:00:00.000',
    timezone: 'America/Los_Angeles',
    durationMinutes: 120,
    reportId: 'report2',
  }];

  beforeEach(async () => {
  });

  describe(`getMusterSchedule()`, () => {
    it(`should produce valid schedules for one-time and recurring muster configs`, () => {
      const schedRecur = getMusterSchedule(
        configs[0].timezone,
        binaryDaysToDateArray(configs[0].days),
        configs[0].startTime,
        configs[0].durationMinutes,
      );
      const schedOneTime = getMusterSchedule(
        configs[1].timezone,
        binaryDaysToDateArray(configs[1].days),
        configs[1].startTime,
        configs[1].durationMinutes,
      );
      // Get a next scheduled range for each and make sure there is data
      expect(schedRecur.nextRange(1).length).not.equal(0);
      expect(schedOneTime.prevRange(1).length).not.equal(0);
    });

    it(`should respect the duration specified in the config`, () => {
      const sched = getMusterSchedule(
        configs[0].timezone,
        binaryDaysToDateArray(configs[0].days),
        configs[0].startTime,
        configs[0].durationMinutes,
      );
      // parse the time from one of the schedule ranges to make sure it is accurate
      const range = sched.prevRange(7, new Date('2020-01-12T00:00:00Z'), new Date('2020-01-05T00:00:00Z'));
      const start = moment(range[0][0]);
      const end = moment(range[0][1]);
      end.subtract(configs[0].durationMinutes, 'minutes');

      expect(start.toISOString()).equal(end.toISOString());
    });

    it(`should respect the days of the week specified in the config (case: weekdays)`, () => {
      const sched = getMusterSchedule(
        configs[0].timezone,
        binaryDaysToDateArray(configs[0].days),
        configs[0].startTime,
        configs[0].durationMinutes,
      );
      // This time range is from a sunday to sunday (non-inclusive) on the calendar.
      // We get up to 7 days but we should get only 5 because the days for config[0]
      // are just for the weekdays.
      const range = sched.prevRange(7, new Date('2020-01-12T00:00:00Z'), new Date('2020-01-05T00:00:00Z'));
      expect(range.length).equal(5);
    });

    it(`should respect the timezone specified in the config (case: LA time)`, () => {
      const sched = getMusterSchedule(
        configs[1].timezone,
        binaryDaysToDateArray(configs[1].days),
        configs[1].startTime,
        configs[1].durationMinutes,
      );
      // This config is set to 2AM west coast time, which is 7-8 behind GMT
      // depending on DST (DST will not affect these test values)
      expect(sched.isValid(new Date('2020-01-02T02:00:00.000Z'))).false;
      expect(sched.isValid(new Date('2020-01-02T10:00:00.000Z'))).true;
    });
  });

  describe(`getCompliantUserObserverationCount()`, () => {
    it(`should return full compliance with recurring and one-time configs`, () => {
      const observations = [{
        report_schema_id: 'report1',
        timestamp: new Date('2020-01-01T08:00:00Z'),
      },
      {
        report_schema_id: 'report2',
        timestamp: new Date('2020-01-02T10:00:00Z'),
      }];
      const count = getCompliantUserObserverationCount(observations, configs);
      expect(count).equal(2);
    });

    it(`should return no compliance for observations outside of recurring and one-time configs`, () => {
      const observations = [{
        report_schema_id: 'report1',
        timestamp: new Date('2020-01-01T10:00:00Z'),
      },
      {
        report_schema_id: 'report2',
        timestamp: new Date('2020-01-02T12:00:00Z'),
      }];
      const count = getCompliantUserObserverationCount(observations, configs);
      expect(count).equal(0);
    });
  });

  describe(`getUnitRequiredMusterCount()`, () => {
    it(`should return correct count with recurring configs (case: weekdays)`, () => {
      // query for a full week of data but since the config is only for weekdays we should get 5 back
      const count = getUnitRequiredMusterCount([configs[0]], moment('2020-01-05T00:00:00Z'), moment('2020-01-12T00:00:00Z'));
      expect(count).equal(5);
    });

    it(`should return correct count with one-time configs`, () => {
      const count = getUnitRequiredMusterCount([configs[1]], moment('2020-01-01T00:00:00Z'), moment('2020-01-03T00:00:00Z'));
      expect(count).equal(1);
    });

    it(`should return correct total count with recurring and one-time configs`, () => {
      // query for a full week of data but since the config is only for weekdays we should get 5 back
      // plus the 1 for the one-time config which should equal 6 in total
      const count = getUnitRequiredMusterCount(configs, moment('2020-01-01T00:00:00Z'), moment('2020-01-08T00:00:00Z'));
      expect(count).equal(6);
    });

    it(`should return zero for invalid dates with recurring and one-time configs`, () => {
      // date is on a weekend, hence the recurring (weekday) config and one-time on 2020-01-02 should both fail
      const count = getUnitRequiredMusterCount(configs, moment('2020-01-04T00:00:00Z'), moment('2020-01-05T00:00:00Z'));
      expect(count).equal(0);
    });

    it(`should return zero for empty configs`, () => {
      // date is on a weekend, hence the recurring (weekday) config and one-time on 2020-01-02 should both fail
      const count = getUnitRequiredMusterCount([], moment('2020-01-04T00:00:00Z'), moment('2020-01-05T00:00:00Z'));
      expect(count).equal(0);
    });
  });
});
