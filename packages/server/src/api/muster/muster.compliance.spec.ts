import { expect } from 'chai';
import { toMusterCompliance } from './muster.compliance';
import { rosterTestDataSimple } from '../../util/test-utils/data/roster-generator';

describe('Muster Compliance', () => {
  describe('toMusterCompliance()', () => {
    it('should calculate muster compliance', () => {
      const rosterIndividualsInformation = rosterTestDataSimple(10, 2, 1);
      // let recordedObservations;
      // let musteringOpportunities;
      // const musterCompliance = toMusterCompliance(rosterIndividualsInformation, recordedObservations, musteringOpportunities);
      // console.log(musterCompliance);
    });
  });
});
