export {};
/** Muster compliance is temporarily broken
import { expect } from 'chai';
import { MusterComplianceByDate, GetMusterRosterQuery, GetMusterComplianceByDateRangeQuery } from '@covid19-reports/shared';
import { expectError, expectNoErrors } from '../../util/test-utils/expect';
import { seedAll } from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import { User } from '../user/user.model';

describe(`Muster Controller`, () => {
  const basePath = '/api/muster';
  const pageParams = {
    limit: '10',
    page: '0',
  };
  const unit5 = 'Unit 5';
  let req: TestRequest;
  let seedData: any[];
  let org1: number;

  beforeEach(async () => {
    seedData = await seedAll();
    req = new TestRequest(basePath);
    req.setUser(await User.findOne());
    // We don't' use a static id since ids may auto increment.
    org1 = seedData.find(data => data.org.indexPrefix === 'testgroup1').org.id;
  });

  describe(`${basePath}/:orgId/roster/complianceByDateRange : get`, () => {
    it(`should return full compliance with multiple active configs`, async () => {
      const query: GetMusterRosterQuery = {
        fromDate: '2020-01-01',
        toDate: '2020-01-03',
        ...pageParams,
      };
      const res = await req.get(`/${org1}/roster/complianceByDateRange`, {
        params: query,
      });
      expectNoErrors(res);
      // this is based on known user data, if the data changes update all the tests under this 'describe'
      const userRate = res.data.rows.find((row: any) => { return row.edipi === '0000000007'; });
      expect(userRate.musterPercent).equal(100);
      expect(userRate.totalMusters).greaterThan(0);
      expect(userRate.totalMusters).equal(userRate.mustersReported);
    });

    it(`should return full compliance with a single active config`, async () => {
      const query: GetMusterRosterQuery = {
        fromDate: '2020-01-03',
        toDate: '2020-01-04',
        ...pageParams,
      };
      const res = await req.get(`/${org1}/roster/complianceByDateRange`, {
        params: query,
      });
      expectNoErrors(res);
      const userRate = res.data.rows.find((row: any) => { return row.edipi === '0000000007'; });
      expect(userRate.musterPercent).equal(100);
      expect(userRate.totalMusters).greaterThan(0);
      expect(userRate.totalMusters).equal(userRate.mustersReported);
    });

    it(`should error with bad date input`, async () => {
      const query: GetMusterRosterQuery = {
        fromDate: 'YYYY-MM-DD',
        toDate: '2020-01-04',
        ...pageParams,
      };
      let res = await req.get(`/${org1}/roster/complianceByDateRange`, {
        params: query,
      });
      expectError(res, 'Invalid ISO date range');

      query.fromDate = '9999-99-99';
      res = await req.get(`/${org1}/roster/complianceByDateRange`, {
        params: query,
      });
      expectError(res, 'Invalid ISO date range');
    });
  });

  describe(`${basePath}/:orgId/:filterId/complianceByDateRange : get`, () => {
    it(`should return full compliance with multiple active configs`, async () => {
      const query: GetMusterComplianceByDateRangeQuery = {
        isoStartDate: '2020-01-01',
        isoEndDate: '2020-01-02',
      };
      const res = await req.get(`/${org1}/${unit5}/complianceByDateRange`, {
        params: query,
      });

      expectNoErrors(res);

      // The configs are active on jan 2 so we make sure to select its entry for testing
      const dayRate = res.data.musterComplianceRates.find((rate: MusterComplianceByDate) => rate.isoDate.split('T')[0] === query.isoEndDate);
      expect(dayRate.musterComplianceRate).equal(1);
    });

    it(`should return full compliance with a single active config`, async () => {
      const query: GetMusterComplianceByDateRangeQuery = {
        isoStartDate: '2020-01-03',
        isoEndDate: '2020-01-04',
      };
      const res = await req.get(`/${org1}/${unit5}/complianceByDateRange`, {
        params: query,
      });

      expectNoErrors(res);

      // The single config is active on jan 3 so we select the item in the list for testing
      const dayRate = res.data.musterComplianceRates.find((rate: MusterComplianceByDate) => rate.isoDate.split('T')[0] === query.isoStartDate);
      expect(dayRate.musterComplianceRate).equal(1);
    });

    it(`should error with bad date input`, async () => {
      const query: GetMusterComplianceByDateRangeQuery = {
        isoStartDate: 'YYYY-MM-DD',
        isoEndDate: '2020-01-04',
      };
      let res = await req.get(`/${org1}/${unit5}/complianceByDateRange`, {
        params: query,
      });
      expectError(res, 'Invalid ISO date range');

      query.isoStartDate = '9999-99-99';
      res = await req.get(`/${org1}/${unit5}/complianceByDateRange`, {
        params: query,
      });
      expectError(res, 'Invalid ISO date range');
    });
  });
});
*/
