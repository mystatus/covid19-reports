import { expect } from 'chai';
import { expectNoErrors } from '../../util/test-utils/expect';
import { seedAll } from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import { User } from '../user/user.model';


describe(`Muster Controller`, () => {
  const basePath = '/api/muster';
  let req: TestRequest;
  let seedData: any[];

  beforeEach(async () => {
    seedData = await seedAll();
    req = new TestRequest(basePath);
    req.setUser(await User.findOne());
  });

  describe(`${basePath}/:orgId/:unitName/compliance : get`, () => {
    it(`returns full muster compliance for Unit 1 test data`, async () => {
      // We can't use a static id since ids may auto increment.
      const org1 = seedData[0].org.id;
      const unit1 = 'Unit 1';
      const res = await req.get(`/${org1}/${unit1}/compliance?timestamp=2020-01-02`);
      expectNoErrors(res);
      expect(res.data.musterComplianceRate).equal(1);
    });
  });

  describe('Detail muster compliance', () => {
    describe(`${basePath}/:orgId/roster`, () => {
      it('returns detail muster compliance for Unit 1 test data', async () => {
        const orgId = seedData[0].org.id;
        const unitId = seedData[0].units[0].id;
        const fromDate = '2020-01-02T00:00:00.000Z';
        const toDate = '2020-01-03T00:00:00.000Z';
        const res = await req.get(`/${orgId}/roster?fromDate=${fromDate}&toDate=${toDate}&unitId=${unitId}&page=0&limit=10`);
        // console.log(res.data);
        // expectNoErrors(res);
        // expect(res.data).equal('BLAH');
      });
    });
  });
});
