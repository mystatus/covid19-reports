import moment from 'moment-timezone';
import { expect } from 'chai';
import { getObservations } from './observation.utils';
import { seedAll } from '../../util/test-utils/seed';


describe('Observation Utils', () => {
  describe('getObservations()', () => {
    const edipi = '0000000007';
    const edipis = [edipi];
    const fromDate = moment.utc('2020-01-02T00:00');
    const toDate = moment.utc('2020-01-03T00:00');

    beforeEach(async () => {
      await seedAll();
    });

    it(`should return all observations for ${edipi} edipi`, async () => {
      const observations = await getObservations(edipis, fromDate, toDate);
      expect(observations.length).equal(2);
    });

    it(`should return the 1st observation with UTC date for ${edipi} edipi`, async () => {
      const observations = await getObservations(edipis, fromDate, toDate);
      expect(observations[0].timestamp.toISOString()).equal('2020-01-02T08:00:00.000Z');
    });

    it(`should return the 2nd observation with UTC date for ${edipi} edipi`, async () => {
      const observations = await getObservations(edipis, fromDate, toDate);
      expect(observations[1].timestamp.toISOString()).equal('2020-01-02T10:00:00.000Z');
    });


    it(`should return a single observation for ${edipi} edipi when from and to dates match one and only one observation`, async () => {
      const observations = await getObservations(edipis, moment.utc('2020-01-02T10:00'), moment.utc('2020-01-02T10:00'));
      expect(observations.length).equal(1);
    });
  });
});
