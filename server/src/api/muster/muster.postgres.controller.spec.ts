import { expect } from 'chai';
import moment from 'moment-timezone';
import later from 'later';
import musterPostgresController, { MusterTimeView, MusterUnitConfiguration } from './muster.postgres.controller';

describe('Muster Postgres Controller', () => {
  it('should work', () => {

    const fromDate = moment('2021-07-01T00:00:00.000Z');
    const toDate = moment('2021-08-01T00:00:00.000Z');
    const musterUnitConf: MusterUnitConfiguration[] = [{
      unitId: 1,
      musterConf: [
        {
          days: 6,
          startTime: '13:00',
          timezone: 'America/Chicago',
          durationMinutes: 60,
          reportId: 'es6ddssymptomobs',
        },
        {
          days: 1,
          startTime: '14:00',
          timezone: 'America/Chicago',
          durationMinutes: 60,
          reportId: 'es6ddssymptomobs',
        },
      ],
    }, {
      unitId: 2,
      musterConf: [
        {
          days: 1,
          startTime: '13:00',
          timezone: 'America/Chicago',
          durationMinutes: 60,
          reportId: 'es6ddssymptomobs',
        },
      ],
    }];
    const mtv:MusterTimeView = musterPostgresController.toMusterTimeView(musterUnitConf, fromDate, toDate);
    console.log(mtv);

  });
  it('experiment with later lib', () => {

    const fromDate = moment.utc('2021-07-01T00:00:00.000Z');
    const toDate = moment.utc('2021-08-01T00:00:00.000Z');

    const dayOfWeek = 7;
    const schedule = later.parse.recur()
      .on(dayOfWeek).dayOfWeek()
      .on(10)
      .hour()
      .on(30)
      .minute();
    const next = later.schedule(schedule).next(10000, fromDate.toDate(), toDate.toDate());

    next.forEach((nextSchedule: any) => {
      console.log(moment.utc(nextSchedule).unix());
      console.log(moment.utc(nextSchedule));
    });
  });
});

