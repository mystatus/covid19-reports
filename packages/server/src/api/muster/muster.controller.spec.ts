import { expect } from 'chai';
import { expectNoErrors } from '../../util/test-utils/expect';
import { seedAll } from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import { User } from '../user/user.model';


describe(`Muster Controller`, () => {
  const basePath = '/api/muster';
  let req: TestRequest;
  let orgData: any[];

  beforeEach(async () => {
    orgData = await seedAll();
    req = new TestRequest(basePath);
    req.setUser(await User.findOne());
  });

  describe(`${basePath}/:orgId/:unitName/compliance : get`, () => {
    it(`returns full muster compliance for Unit 1 test data`, async () => {
      // We can't use a static id since ids may auto increment.
      const org1 = orgData[0].org.id;
      const unit1 = 'Unit 1';
      const res = await req.get(`/${org1}/${unit1}/compliance?timestamp=2020-01-02`);
      expectNoErrors(res);
      expect(res.data.musterComplianceRate).equal(1);
    });
  });
});
