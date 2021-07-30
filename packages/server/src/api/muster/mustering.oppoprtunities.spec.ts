import { expect } from 'chai';
import moment from 'moment-timezone';
import { MusterConfWithDateArray } from '@covid19-reports/shared';
import {
  toMusterWindows,
  MusterWindowWithStartAndEndDate, MusteringOpportunities, toMusterOpportunitiesWithUnits,
  toMusterOpportunities,

} from './mustering.opportunities';
import { toUnitMusterConf, UnitMusterConf, UnitMusterConfFromDb } from './muster.configuration';

describe('Mustering Opportunities', () => {

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
    const mtv:UnitMusterConf[] = toUnitMusterConf(rawMusterUnitConf);
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
    const timeViews: MusterWindowWithStartAndEndDate[] = toMusterOpportunities(input, fromDate, toDate);
    asertEqual(timeViews, toExpectedUnitOnePartOneDate());
  });

  it('toMusterTimeView() should convert all muster config to date range list of muster windows', () => {

    const fromDate = moment('2021-07-01T00:00:00.000Z');
    const toDate = moment('2021-08-01T00:00:00.000Z');
    const input: UnitMusterConf[] = [
      {
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
      },
      {
        unitId: 2,
        musterConf: [
          {
            days: [4],
            startTime: '12:00',
            timezone: 'America/Chicago',
            durationMinutes: 30,
            reportId: 'es6ddssymptomobs',
          },
        ],
      },
    ];
    const timeView = toMusterOpportunitiesWithUnits(input, fromDate, toDate);

    const expectedUnitOneDates = [toExpectedUnitOnePartOneDate(), toExpectedUnitOnePartTwoDate()].flat(1);
    const expectedUnitTwoDates = toExpectedUnitTwoPartOneDate();
    const expected = {1: expectedUnitOneDates, 2: expectedUnitTwoDates};
    asertEqualTwoUnits(timeView, expected);
  });

  it('getMusterTimeViewWithEndTimes() should calculate the end date', () => {

    const startDate = '2021-07-07T06:00:00.000Z';
    const expectedEndDate = '2021-07-07T07:00:00.000Z';
    const durationMinutes = 60;
    const dates: Date[][] = [[moment.utc(startDate).toDate()]];

    const timeViews: MusterWindowWithStartAndEndDate[] = toMusterWindows(dates, durationMinutes);

    expect([timeViews[0].startMusterDate.unix(), timeViews[0].endMusterDate.unix()])
      .to.eql([moment.utc(startDate).unix(), moment.utc(expectedEndDate).unix()]);
  });
});

function addDates(output: MusterWindowWithStartAndEndDate[], startDate: string, endDate: string) {
  output.push({
    startMusterDate: moment.utc(startDate),
    endMusterDate: moment.utc(endDate),
  });
}

function toExpectedUnitOnePartOneDate() {
  const expectedOutput: MusterWindowWithStartAndEndDate[] = [];
  addDates(expectedOutput, '2021-07-05T18:00:00Z', '2021-07-05T19:00:00Z');
  addDates(expectedOutput, '2021-07-12T18:00:00Z', '2021-07-12T19:00:00Z');
  addDates(expectedOutput, '2021-07-19T18:00:00Z', '2021-07-19T19:00:00Z');
  addDates(expectedOutput, '2021-07-26T18:00:00Z', '2021-07-26T19:00:00Z');
  addDates(expectedOutput, '2021-07-06T18:00:00Z', '2021-07-06T19:00:00Z');
  addDates(expectedOutput, '2021-07-13T18:00:00Z', '2021-07-13T19:00:00Z');
  addDates(expectedOutput, '2021-07-20T18:00:00Z', '2021-07-20T19:00:00Z');
  addDates(expectedOutput, '2021-07-27T18:00:00Z', '2021-07-27T19:00:00Z');
  return expectedOutput;
}

function toExpectedUnitOnePartTwoDate() {
  const expectedOutput: MusterWindowWithStartAndEndDate[] = [];
  addDates(expectedOutput, '2021-07-04T19:00:00Z', '2021-07-04T21:00:00Z');
  addDates(expectedOutput, '2021-07-11T19:00:00Z', '2021-07-11T21:00:00Z');
  addDates(expectedOutput, '2021-07-18T19:00:00Z', '2021-07-18T21:00:00Z');
  addDates(expectedOutput, '2021-07-25T19:00:00Z', '2021-07-25T21:00:00Z');
  return expectedOutput;
}

function toExpectedUnitTwoPartOneDate() {
  const expectedOutput: MusterWindowWithStartAndEndDate[] = [];
  addDates(expectedOutput, '2021-07-07T17:00:00Z', '2021-07-07T17:30:00Z');
  addDates(expectedOutput, '2021-07-14T17:00:00Z', '2021-07-14T17:30:00Z');
  addDates(expectedOutput, '2021-07-21T17:00:00Z', '2021-07-21T17:30:00Z');
  addDates(expectedOutput, '2021-07-28T17:00:00Z', '2021-07-28T17:30:00Z');
  return expectedOutput;
}

function asertEqual(timeViews: MusterWindowWithStartAndEndDate[], expectedOutput: MusterWindowWithStartAndEndDate[]) {
  for (let i = 0; i < timeViews.length; i++) {
    expect(timeViews[i].startMusterDate.unix()).to.eql(expectedOutput[i].startMusterDate.unix());
    expect(timeViews[i].endMusterDate.unix()).to.eql(expectedOutput[i].endMusterDate.unix());
  }
}

function asertEqualTwoUnits(timeView: MusteringOpportunities, expected: { '1': FlatArray<MusterWindowWithStartAndEndDate[][], 1>[]; '2': MusterWindowWithStartAndEndDate[] }) {
  asertEqual(timeView[1], expected[1]);
  asertEqual(timeView[2], expected[2]);
}
