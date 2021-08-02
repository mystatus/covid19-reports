import { expect } from 'chai';
import { GetMusterComplianceByDateResponse } from '@covid19-reports/shared';
import { expectError, expectNoErrors } from '../../util/test-utils/expect';
import { seedAll } from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import { User } from '../user/user.model';

describe(`Muster Controller`, () => {
  const basePath = '/api/muster';
  const unit1 = 'Unit 1';
  let req: TestRequest;
  let seedData: any[];
  let org1: number;

  beforeEach(async () => {
    seedData = await seedAll();
    req = new TestRequest(basePath);
    req.setUser(await User.findOne());
    // We don't' use a static id since ids may auto increment.
    org1 = seedData[0].org.id;
  });

  describe(`${basePath}/:orgId/:unitName/complianceByDate : get`, () => {
    it(`should return full compliance with multiple active configs`, async () => {
      const res = await req.get(`/${org1}/${unit1}/complianceByDate?isoDate=2020-01-02`);
      expectNoErrors(res);
      expect(res.data.musterComplianceRate).equal(1);
    });

    it(`should return full compliance with a single active config`, async () => {
      const res = await req.get(`/${org1}/${unit1}/complianceByDate?isoDate=2020-01-03`);
      expectNoErrors(res);
      expect(res.data.musterComplianceRate).equal(1);
    });

    it(`should error with bad date input`, async () => {
      const res = await req.get(`/${org1}/${unit1}/complianceByDate?isoDate=YYYY-MM-DD`);
      expectError(res, 'Invalid ISO date.');
    });
  });

  describe(`${basePath}/:orgId/:unitName/complianceByDateRange : get`, () => {
    it(`should return full compliance with multiple active configs`, async () => {
      const res = await req.get(`/${org1}/${unit1}/complianceByDateRange?isoStartDate=2020-01-01&isoEndDate=2020-01-02`);
      expectNoErrors(res);

      // The configs are active on jan 2 so we make sure to select its entry for testing
      const dayRate = res.data.musterComplianceRates.find((rate: GetMusterComplianceByDateResponse) => rate.isoDate.split('T')[0] === '2020-01-02');
      expect(dayRate.musterComplianceRate).equal(1);
    });

    it(`should return full compliance with a single active config`, async () => {
      const res = await req.get(`/${org1}/${unit1}/complianceByDateRange?isoStartDate=2020-01-03&isoEndDate=2020-01-04`);
      expectNoErrors(res);

      // The single config is active on jan 3 so we select the item in the list for testing
      const dayRate = res.data.musterComplianceRates.find((rate: GetMusterComplianceByDateResponse) => rate.isoDate.split('T')[0] === '2020-01-03');
      expect(dayRate.musterComplianceRate).equal(1);
    });
  });
});
