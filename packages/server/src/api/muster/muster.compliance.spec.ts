import { expect } from 'chai';
import { toMusterCompliance } from './muster.compliance';
import { getRosterTestDataSimple } from '../../util/test-utils/roster.test-generator';

describe('Muster Compliance', () => {
  describe('toMusterCompliance()', () => {
    it('should calculate muster compliance', () => {
      const rosterIndividualsInformation = getRosterTestDataSimple(10, 2, 1);
      // let recordedObservations;
      // let musteringOpportunities;
      // const musterCompliance = toMusterCompliance(rosterIndividualsInformation, recordedObservations, musteringOpportunities);
      // console.log(musterCompliance);
    });
  });
});
