import { expect } from 'chai';
import moment from 'moment-timezone';
import {
  calculateMusterCompliance,
  MusterCompliance,
  RosterForMusterCompliance,
} from './muster.compliance';
import { RecordedObservations } from '../observation/observation.utils';
import { MusteringOpportunities } from './mustering.opportunities';


describe('Muster Compliance', () => {
  describe('calculateMusterCompliance()', () => {
    let edipi;
    let unitId: number;
    let observations: RecordedObservations[];
    let musteringOpportunities: MusteringOpportunities;
    let noMusteringOpportunities: MusteringOpportunities;
    let rosterForMusterCompliance: RosterForMusterCompliance[];
    let totalMusteringOpportunities: number;
    beforeEach(() => {
      edipi = '0000000007';
      unitId = 1;
      const nonExistentUnitId = 1000000;
      const firstObservationDate = '2020-01-02T08:00:00.000Z';
      const secondObservationDate = '2020-01-02T10:00:00.000Z';
      const musterWindowStartData = '2020-01-02T08:00:00.000Z';
      const musterWindowEndDate = '2020-01-02T10:00:00.000Z';

      observations = [
        { edipi, timestamp: new Date(firstObservationDate) },
        { edipi, timestamp: new Date(secondObservationDate) },
      ];

      musteringOpportunities = { [unitId]:
          [{ startMusterDate: moment(musterWindowStartData),
            endMusterDate: moment(musterWindowEndDate) }] };

      noMusteringOpportunities = { [nonExistentUnitId]:
          [{ startMusterDate: moment(musterWindowStartData),
            endMusterDate: moment(musterWindowEndDate) }] };

      totalMusteringOpportunities = musteringOpportunities[unitId].length;

      rosterForMusterCompliance = [
        { edipi,
          firstName: 'test firstName',
          lastName: 'test lastName',
          myCustomColumn1: 'test customColumn',
          unitId,
          phone: 'test phone' },
      ];
    });
    describe('single unit tests', () => {
      describe('single edipi tests', () => {
        it(`should return unit muster compliance`, () => {
          const musterCompliance: MusterCompliance[] = calculateMusterCompliance(observations, musteringOpportunities, rosterForMusterCompliance);
          expect(musterCompliance[0].unitId).equal(unitId);
        });
        it(`should return total mustering opportunities`, () => {
          const musterCompliance: MusterCompliance[] = calculateMusterCompliance(observations, musteringOpportunities, rosterForMusterCompliance);
          expect(musterCompliance[0].totalMusters).equal(totalMusteringOpportunities);
        });
        it(`should return compliance percentage`, () => {
          const musterCompliance: MusterCompliance[] = calculateMusterCompliance(observations, musteringOpportunities, rosterForMusterCompliance);
          expect(musterCompliance[0].musterPercent).equal(100);
        });
        it(`should return compliance`, () => {
          const musterCompliance: MusterCompliance[] = calculateMusterCompliance(observations, musteringOpportunities, rosterForMusterCompliance);
          expect(musterCompliance[0].mustersReported).equal(1);
        });
        it(`should return 100% compliance when mustering is not required`, () => {
          const musterCompliance: MusterCompliance[] = calculateMusterCompliance(observations, noMusteringOpportunities, rosterForMusterCompliance);
          expect(musterCompliance[0].musterPercent).equal(100);
        });
      });
    });
  });
});
