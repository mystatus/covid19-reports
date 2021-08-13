import { expect } from 'chai';
import { expectNoErrors } from '../../util/test-utils/expect';
import { seedAll } from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import { User } from '../user/user.model';
import { Unit } from '../unit/unit.model';


describe('Muster Controller Compliance', () => {
  const basePath = '/api/muster';
  let req: TestRequest;
  let seedData: any[];
  let orgId: number;
  let unitId: number;

  beforeEach(async () => {
    seedData = await seedAll();
    req = new TestRequest(basePath);
    req.setUser(await User.findOne());

    orgId = seedData[0].org.id;
    unitId = seedData[0].units.find(((u: Unit) => u.name === 'Unit 1' && u.org!.id === orgId)).id;
  });

  it('should return calculated compliance', async () => {
    const fromDate = '2020-01-01T00:00:00.000';
    const toDate = '2020-01-14T23:00:00.000';

    const res = await req.get(`/${orgId}/roster?fromDate=${fromDate}Z&toDate=${toDate}&unitId=${unitId}&page=0&limit=10`);

    expectNoErrors(res);
    expect(res.data)
      .is
      .eql(
        { rows: [
          { totalMusters: 10,
            mustersReported: 5,
            musterPercent: 50,
            edipi: '0000000007',
            firstName: 'RosterFirst7',
            lastName: 'RosterLast7',
            myCustomColumn1: 'tbd',
            unitId,
            phone: '1234567890' },
          {
            edipi: '0000000012',
            firstName: 'RosterFirst12',
            lastName: 'RosterLast12',
            musterPercent: 50,
            mustersReported: 5,
            myCustomColumn1: 'tbd',
            phone: '1234567890',
            totalMusters: 10,
            unitId,
          },
          {
            edipi: '0000000017',
            firstName: 'RosterFirst17',
            lastName: 'RosterLast17',
            musterPercent: 50,
            mustersReported: 5,
            myCustomColumn1: 'tbd',
            phone: '1234567890',
            totalMusters: 10,
            unitId,
          },
          {
            edipi: '0000000022',
            firstName: 'RosterFirst22',
            lastName: 'RosterLast22',
            musterPercent: 50,
            mustersReported: 5,
            myCustomColumn1: 'tbd',
            phone: '1234567890',
            totalMusters: 10,
            unitId,
          }],
        totalRowsCount: 4 },
      );
  });
});
