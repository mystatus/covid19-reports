import { expect } from 'chai';
import moment from 'moment-timezone';
import { calculateMusterCompliance } from './muster.compliance';

const edipi7 = '0000000007';
const edipi8 = '0000000008';
const edipi9 = '0000000009';
const edipi1 = '0000000001';
const unitId1 = 1;
const unitId2 = 2;
const nonExistentUnitId = 1000000;

const eightAM = '2020-01-02T08:00:00.000Z';
const tenAM = '2020-01-02T10:00:00.000Z';
const fivePM = '2020-01-03T17:00:00.000Z';
const fiveThirtyPM = '2020-01-03T17:30:00.000Z';
const tenPM = '2020-01-05T22:00:00.000Z';
const tenThirtyPM = '2020-01-05T22:30:00.000Z';
const elevenPM = '2020-01-05T23:00:00.000Z';


const observationsWithSingleEdipi = [
  { edipi: edipi7, timestamp: new Date(eightAM) },
];

const observationsWithTwoEdipis = [
  // edipi7 100% compliance
  { edipi: edipi7, timestamp: new Date(eightAM) },
  { edipi: edipi7, timestamp: new Date(fiveThirtyPM) },
  { edipi: edipi7, timestamp: new Date(tenPM) },
  // edipi9 33% compliance
  { edipi: edipi9, timestamp: new Date(tenThirtyPM) },
  // edipi8 0% compliance
];

const observationsWithThreeEdipis = [
  // edipi1 100% compliance
  { edipi: edipi1, timestamp: new Date(eightAM) },
  // edipi7 100% compliance
  { edipi: edipi7, timestamp: new Date(eightAM) },
  { edipi: edipi7, timestamp: new Date(fiveThirtyPM) },
  { edipi: edipi7, timestamp: new Date(tenPM) },
  // edipi9 33% compliance
  { edipi: edipi9, timestamp: new Date(tenThirtyPM) },
  // edipi8 0% compliance
];

const singleMusteringOpportunity = { [unitId1]:
    [{ startMusterDate: moment(eightAM),
      endMusterDate: moment(tenAM) }] };

const threeMusteringOpportunities = { [unitId1]: [
  { startMusterDate: moment(eightAM), endMusterDate: moment(tenAM) },
  { startMusterDate: moment(fivePM), endMusterDate: moment(fiveThirtyPM) },
  { startMusterDate: moment(tenPM), endMusterDate: moment(elevenPM) },
] };

const multipleUntisMusteringOpportunities = {
  [unitId1]: [
    { startMusterDate: moment(eightAM), endMusterDate: moment(tenAM) },
    { startMusterDate: moment(fivePM), endMusterDate: moment(fiveThirtyPM) },
    { startMusterDate: moment(tenPM), endMusterDate: moment(elevenPM) },
  ],
  [unitId2]: [
    { startMusterDate: moment(eightAM), endMusterDate: moment(tenAM) },
  ],
};

const noMusteringOpportunities = { [nonExistentUnitId]:
    [{ startMusterDate: moment(eightAM),
      endMusterDate: moment(tenAM) }] };

const totalMusteringOpportunities = singleMusteringOpportunity[unitId1].length;

const singleEdipiRoster = [
  { edipi: edipi7,
    firstName: 'test firstName',
    lastName: 'test lastName',
    myCustomColumn1: 'test customColumn',
    unitId: unitId1,
    phone: 'test phone' },
];

const rosterWithThreeEdipis = [
  { edipi: edipi7,
    firstName: 'test firstName',
    lastName: 'test lastName',
    myCustomColumn1: 'test customColumn',
    unitId: unitId1,
    phone: 'test phone' },
  { edipi: edipi8,
    firstName: 'test firstName',
    lastName: 'test lastName',
    myCustomColumn1: 'test customColumn',
    unitId: unitId1,
    phone: 'test phone' },
  { edipi: edipi9,
    firstName: 'test firstName',
    lastName: 'test lastName',
    myCustomColumn1: 'test customColumn',
    unitId: unitId1,
    phone: 'test phone' },
];

const rosterWithThreeEdipisTwoUnits = [
  { edipi: edipi7,
    firstName: 'test firstName',
    lastName: 'test lastName',
    myCustomColumn1: 'test customColumn',
    unitId: unitId1,
    phone: 'test phone' },
  { edipi: edipi8,
    firstName: 'test firstName',
    lastName: 'test lastName',
    myCustomColumn1: 'test customColumn',
    unitId: unitId1,
    phone: 'test phone' },
  { edipi: edipi9,
    firstName: 'test firstName',
    lastName: 'test lastName',
    myCustomColumn1: 'test customColumn',
    unitId: unitId1,
    phone: 'test phone' },
  { edipi: edipi1,
    firstName: 'test firstName',
    lastName: 'test lastName',
    myCustomColumn1: 'test customColumn',
    unitId: unitId2,
    phone: 'test phone' },
];

describe('Muster Compliance', () => {
  describe('calculateMusterCompliance()', () => {
    describe('single unit', () => {
      describe('single edipi', () => {
        it(`should return unit muster compliance`, () => {
          const musterCompliance = calculateMusterCompliance(observationsWithSingleEdipi, singleMusteringOpportunity, singleEdipiRoster);
          expect(musterCompliance[0].unitId).equal(unitId1);
        });
        it(`should return total mustering opportunities`, () => {
          const musterCompliance = calculateMusterCompliance(observationsWithSingleEdipi, singleMusteringOpportunity, singleEdipiRoster);
          expect(musterCompliance[0].totalMusters).equal(totalMusteringOpportunities);
        });
        it(`should return compliance percentage`, () => {
          const musterCompliance = calculateMusterCompliance(observationsWithSingleEdipi, singleMusteringOpportunity, singleEdipiRoster);
          expect(musterCompliance[0].musterPercent).equal(100);
        });
        it(`should return compliance`, () => {
          const musterCompliance = calculateMusterCompliance(observationsWithSingleEdipi, singleMusteringOpportunity, singleEdipiRoster);
          expect(musterCompliance[0].mustersReported).equal(1);
        });
        it(`should return 100% compliance when mustering is not required`, () => {
          const musterCompliance = calculateMusterCompliance(observationsWithSingleEdipi, noMusteringOpportunities, singleEdipiRoster);
          expect(musterCompliance[0].musterPercent).equal(100);
        });
      });
      describe('multiple edipis', () => {
        describe('multiple mustering opportunities', () => {
          it(`should return total mustering opportunities`, () => {
            const musterCompliance = calculateMusterCompliance(observationsWithTwoEdipis, threeMusteringOpportunities, rosterWithThreeEdipis);
            expect(musterCompliance).is.eql([
              {
                edipi: '0000000007',
                firstName: 'test firstName',
                lastName: 'test lastName',
                musterPercent: 100,
                mustersReported: 3,
                myCustomColumn1: 'test customColumn',
                phone: 'test phone',
                totalMusters: 3,
                unitId: 1,
              },
              {
                edipi: '0000000008',
                firstName: 'test firstName',
                lastName: 'test lastName',
                musterPercent: 0,
                mustersReported: 0,
                myCustomColumn1: 'test customColumn',
                phone: 'test phone',
                totalMusters: 3,
                unitId: 1,
              },
              {
                edipi: '0000000009',
                firstName: 'test firstName',
                lastName: 'test lastName',
                musterPercent: 33.3,
                mustersReported: 1,
                myCustomColumn1: 'test customColumn',
                phone: 'test phone',
                totalMusters: 3,
                unitId: 1,
              },
            ]);
          });
        });
      });
    });
    describe('multiple units', () => {
      describe('multiple edipis', () => {
        describe('multiple mustering opportunities', () => {
          it(`should return total mustering opportunities`, () => {
            const musterCompliance = calculateMusterCompliance(observationsWithThreeEdipis, multipleUntisMusteringOpportunities, rosterWithThreeEdipisTwoUnits);
            expect(musterCompliance).is.eql([
              {
                edipi: '0000000007',
                firstName: 'test firstName',
                lastName: 'test lastName',
                musterPercent: 100,
                mustersReported: 3,
                myCustomColumn1: 'test customColumn',
                phone: 'test phone',
                totalMusters: 3,
                unitId: 1,
              },
              {
                edipi: '0000000008',
                firstName: 'test firstName',
                lastName: 'test lastName',
                musterPercent: 0,
                mustersReported: 0,
                myCustomColumn1: 'test customColumn',
                phone: 'test phone',
                totalMusters: 3,
                unitId: 1,
              },
              {
                edipi: '0000000009',
                firstName: 'test firstName',
                lastName: 'test lastName',
                musterPercent: 33.3,
                mustersReported: 1,
                myCustomColumn1: 'test customColumn',
                phone: 'test phone',
                totalMusters: 3,
                unitId: 1,
              },
              {
                edipi: '0000000001',
                firstName: 'test firstName',
                lastName: 'test lastName',
                musterPercent: 100,
                mustersReported: 1,
                myCustomColumn1: 'test customColumn',
                phone: 'test phone',
                totalMusters: 1,
                unitId: 2,
              },
            ]);
          });
        });
      });
    });
  });
});

