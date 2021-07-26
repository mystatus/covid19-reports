import { expect } from 'chai';
import moment from 'moment-timezone';
import musterPostgresController, { MusterTimeView, UnitMusterConf, UnitMusterConfFromDb} from './muster.postgres.controller';
import { MusterConfWithDateArray } from '../unit/unit.model';

function addDates(output: MusterTimeView[], startDate: string, endDate: string) {
  output.push({
    startMusterDate: moment.utc(startDate),
    endMusterDate: moment.utc(endDate),
  });
}

describe('Muster Postgres Controller', () => {

  it('toUnitMusterConf() should convert "binary" date format to "array" date format', () => {

    const rawMusterUnitConf: UnitMusterConfFromDb[] = [
      {
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
      },
      {
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
    const mtv:UnitMusterConf[] = musterPostgresController.toUnitMusterConf(rawMusterUnitConf);
    expect(mtv).to.eql(expected);
  });

  it('toSingleMusterTimeView() should convert single muster config to date range list of muster windows', () => {

    const fromDate = moment('2021-07-01T00:00:00.000Z');
    const toDate = moment('2021-08-01T00:00:00.000Z');

    const input: MusterConfWithDateArray = {
      days: [2, 3],
      startTime: '13:00',
      timezone: 'America/Chicago',
      durationMinutes: 60,
      reportId: 'es6ddssymptomobs',
    };

    const expectedOutput: MusterTimeView[] = [];
    addDates(expectedOutput, '2021-07-05T18:00:00Z', '2021-07-05T19:00:00Z');
    addDates(expectedOutput, '2021-07-12T18:00:00Z', '2021-07-12T19:00:00Z');
    addDates(expectedOutput, '2021-07-19T18:00:00Z', '2021-07-19T19:00:00Z');
    addDates(expectedOutput, '2021-07-26T18:00:00Z', '2021-07-26T19:00:00Z');
    addDates(expectedOutput, '2021-07-06T18:00:00Z', '2021-07-06T19:00:00Z');
    addDates(expectedOutput, '2021-07-13T18:00:00Z', '2021-07-13T19:00:00Z');
    addDates(expectedOutput, '2021-07-20T18:00:00Z', '2021-07-20T19:00:00Z');
    addDates(expectedOutput, '2021-07-27T18:00:00Z', '2021-07-27T19:00:00Z');

    const timeViews: MusterTimeView[] = musterPostgresController.toSingleMusterTimeView(input, fromDate, toDate);

    for (let i = 0; i < timeViews.length; i++) {
      expect(timeViews[i].startMusterDate.unix()).to.eql(expectedOutput[i].startMusterDate.unix());
      expect(timeViews[i].endMusterDate.unix()).to.eql(expectedOutput[i].endMusterDate.unix());
    }
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

