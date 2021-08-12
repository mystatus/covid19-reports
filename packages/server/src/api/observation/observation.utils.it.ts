import moment from 'moment-timezone';
import { expect } from 'chai';
import { getObservations } from './observation.utils';
import { seedAll } from '../../util/test-utils/seed';


describe('Observation Utils', () => {
  describe('getObservations()', () => {
    const edipis = ['0000000007'];
    const fromDate = moment.utc('2020-01-02T00:00');
    const toDate = moment.utc('2020-01-03T00:00');

    beforeEach(async () => {
      await seedAll();
    });

    it('should return all observations for 0000000007 edipi', async () => {
      const observations = await getObservations(edipis, fromDate, toDate);
      expect(observations.length).equal(2);
    });

    it('should return the 1st observation with UTC date for 0000000007 edipi', async () => {
      const observations = await getObservations(edipis, fromDate, toDate);
      expect(observations[0].timestamp.toISOString()).equal('2020-01-02T08:00:00.000Z');
    });

    it('should return the 2nd observation with UTC date for 0000000007 edipi', async () => {
      const observations = await getObservations(edipis, fromDate, toDate);
      expect(observations[1].timestamp.toISOString()).equal('2020-01-02T10:00:00.000Z');
    });
  });
});
