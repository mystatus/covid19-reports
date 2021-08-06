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

    it('should return the 1st observations with UTC date for 0000000007 edipi', async () => {
      const observations = await getObservations(edipis, fromDate, toDate);
      expect(observations[0].timestamp.toUTCString()).equal('Thu, 02 Jan 2020 08:00:00 GMT');
    });

    it('should return the 2st observations with UTC date for 0000000007 edipi', async () => {
      const observations = await getObservations(edipis, fromDate, toDate);
      expect(observations[1].timestamp.toUTCString()).equal('Thu, 02 Jan 2020 10:00:00 GMT');
    });
  });
});
