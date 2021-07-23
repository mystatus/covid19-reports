import { expect } from 'chai';
import moment from 'moment-timezone';
import later from 'later';
import musterPostgresController, {
  MusterTimeView,
  UnitMusterConf,
  UnitMusterConfFromDb, UnitTimeView,
} from './muster.postgres.controller';
import { MusterConfWithDateArray } from '../unit/unit.model';

describe('Muster Postgres Controller', () => {

  it('toUnitMusterConf() should convert "binary" date format to "array" date format', () => {

    // const fromDate = moment('2021-07-01T00:00:00.000Z');
    // const toDate = moment('2021-08-01T00:00:00.000Z');
    const musterUnitConf: UnitMusterConfFromDb[] = [{
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
          durationMinutes: 120,
          reportId: 'es6ddssymptomobs',
        },
      ],
    }, {
      unitId: 2,
      musterConf: [
        {
          days: 2,
          startTime: '12:00',
          timezone: 'America/Chicago',
          durationMinutes: 180,
          reportId: 'es6ddssymptomobs',
        },
      ],
    }];
    const expected: UnitMusterConf[] = [{
      unitId: 1,
      musterConf: [
        {
          days: [2, 3],
          startTime: '13:00',
          timezone: 'America/Chicago',
          durationMinutes: 60,
          reportId: 'es6ddssymptomobs',
        },
        {
          days: [1],
          startTime: '14:00',
          timezone: 'America/Chicago',
          durationMinutes: 120,
          reportId: 'es6ddssymptomobs',
        },
      ],
    }, {
      unitId: 2,
      musterConf: [
        {
          days: [2],
          startTime: '12:00',
          timezone: 'America/Chicago',
          durationMinutes: 180,
          reportId: 'es6ddssymptomobs',
        },
      ],
    }];
    const mtv:UnitMusterConf[] = musterPostgresController.toUnitMusterConf(musterUnitConf);
    expect(mtv).to.eql(expected);
  });

  it('toMusterTimeView() should convert single muster config to date range list of muster windows', () => {

    const fromDate = moment('2021-07-01T00:00:00.000Z');
    const toDate = moment('2021-08-01T00:00:00.000Z');

    const input: MusterConfWithDateArray = {
      days: [2, 3],
      startTime: '13:00',
      timezone: 'America/Chicago',
      durationMinutes: 60,
      reportId: 'es6ddssymptomobs',
    };

    const timeViews: MusterTimeView[] = musterPostgresController.toSingleMusterTimeView(input, fromDate, toDate);
    timeViews.forEach(tw => {
      console.log(moment.utc(tw.startMusterTime));
    });
  });

  it('toMusterTimeView() should convert all muster config to date range list of muster windows', () => {

    const fromDate = moment('2021-07-01T00:00:00.000Z');
    const toDate = moment('2021-08-01T00:00:00.000Z');
    const input: UnitMusterConf[] = [{
      unitId: 1,
      musterConf: [
        {
          days: [2, 3],
          startTime: '13:00',
          timezone: 'America/Chicago',
          durationMinutes: 60,
          reportId: 'es6ddssymptomobs',
        },
        {
          days: [1],
          startTime: '14:00',
          timezone: 'America/Chicago',
          durationMinutes: 120,
          reportId: 'es6ddssymptomobs',
        },
      ],
    }, {
      unitId: 2,
      musterConf: [
        {
          days: [2],
          startTime: '12:00',
          timezone: 'America/Chicago',
          durationMinutes: 180,
          reportId: 'es6ddssymptomobs',
        },
      ],
    }];
    // TODO: to do later
    const timeView = musterPostgresController.toMusterTimeView(input, fromDate, toDate);
    console.log(timeView);

  });

});

