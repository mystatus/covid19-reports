import { expect } from 'chai';
import { expectNoErrors } from '../../util/test-utils/expect';
import { seedAll } from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import { User } from '../user/user.model';
import { Unit } from '../unit/unit.model';


describe('Muster Controller - Compliance', () => {
  const basePath = '/api/muster';
  let req: TestRequest;
  let seedData: any[];
  let orgId: number;
  let unitId: number;

  beforeEach(async () => {
    seedData = await seedAll();
    req = new TestRequest(basePath);
    req.setUser(await User.findOne());
    // We don't' use a static id since ids may auto increment.
    orgId = seedData[0].org.id;
    unitId = seedData[0].units.filter(((u: Unit) => u.name === 'Unit 1')).map((unit: { id: any }) => unit.id)[0];
  });

  it('should return full compliance with multiple active configs', async () => {
    const fromDate = '2020-01-05T14:00:00.000Z';
    const toDate = '2020-01-05T16:00:00.000Z';
    const res = await req.get(`/${orgId}/roster?fromDate=${fromDate}Z&toDate=${toDate}&unitId=${unitId}&page=0&limit=1`);
    expectNoErrors(res);
    expect(res.data)
      .is
      .eql({});
  });

  // describe('Muster Compliance', () => {
  //   describe(`${basePath}/:orgId/:unitName/complianceByDate : get`, () => {
  //     it('should return full compliance with multiple active configs', async () => {
  //       const fromDate = '2020-01-05T14:00:00.000Z';
  //       const toDate = '2020-01-05T16:00:00.000Z';
  //       const res = await req.get(`/${orgId}/roster?fromDate=${fromDate}Z&toDate=${toDate}&unitId=${unitId}&page=0&limit=1`);
  //       expectNoErrors(res);
  //       expect(res.data)
  //         .is
  //         .eql({});
  //     });
  //   });
  // });
});
