import { expect } from 'chai';
import _ from 'lodash';
import { formatPhoneNumber } from '../../util/string-utils';
import { expectNoErrors } from '../../util/test-utils/expect';
import { seedOrgContactRoles } from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import {
  uniqueEmail,
  uniquePhone,
  uniqueString,
} from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { seedUnit } from '../unit/unit.model.mock';
import { UserRole } from '../user/user-role.model';
import { User } from '../user/user.model';
import {
  seedUser,
  seedUsers,
} from '../user/user.model.mock';
import { IssueAccessRequestBody } from './access-request.controller';
import {
  seedAccessRequest,
  seedAccessRequests,
} from './access-request.model.mock';
import {
  AccessRequest,
  AccessRequestStatus,
} from './access-request.model';

describe(`AccessRequest Controller`, () => {

  const basePath = '/api/access-request';
  let req: TestRequest;
  let org: Org;
  let contact: User;
  let roleAdmin: Role;

  beforeEach(async () => {
    req = new TestRequest(basePath);
    ({ contact, org, roleAdmin } = await seedOrgContactRoles());
  });

  describe(`${basePath}/:orgId : get`, () => {

    it(`returns the org's access requests`, async () => {
      const users = await seedUsers({ count: 2 });
      const accessRequests = await seedAccessRequests(users, org);

      req.setUser(contact);
      const res = await req.get(`/${org.id}`);

      expectNoErrors(res);
      expect(res.data).to.be.array();
      expect(res.data).to.have.lengthOf(2);
      const dataIds = res.data.map((x: AccessRequest) => x.id);
      expect(dataIds).to.include.members([
        accessRequests[0].id,
        accessRequests[1].id,
      ]);
    });

  });

  describe(`${basePath}/:orgId : post`, () => {

    it(`issues an access request`, async () => {
      const user = await seedUser();

      const accessRequestsCountBefore = await AccessRequest.count({
        where: { org },
      });

      const body: IssueAccessRequestBody = {
        whatYouDo: [uniqueString(), uniqueString()],
        sponsorName: uniqueString(),
        sponsorEmail: uniqueEmail(),
        sponsorPhone: uniquePhone(),
        justification: uniqueString(),
      };

      req.setUser(user);
      const res = await req.post(`/${org.id}`, body);

      expectNoErrors(res);

      const accessRequestsAfter = await AccessRequest.find({
        where: { org },
      });
      expect(accessRequestsAfter).to.have.lengthOf(accessRequestsCountBefore + 1);
      const request = accessRequestsAfter[0];
      expect(request.status).to.equal(AccessRequestStatus.Pending);
      expect(request.whatYouDo).to.eql(body.whatYouDo);
      expect(request.sponsorName).to.equal(body.sponsorName);
      expect(request.sponsorEmail).to.equal(body.sponsorEmail);
      expect(request.sponsorPhone).to.equal(formatPhoneNumber(body.sponsorPhone));
    });

  });

  describe(`${basePath}/:orgId/cancel : post`, () => {

    it(`deletes the user's access request`, async () => {
      const users = await seedUsers({ count: 2 });
      await seedAccessRequests(users, org);

      const accessRequestsBefore = await AccessRequest.find({
        where: { org },
        relations: ['user'],
      });
      const accessRequestsBeforeEdipis = accessRequestsBefore.map(x => x.user!.edipi);
      expect(accessRequestsBeforeEdipis).to.include(users[0].edipi);

      req.setUser(users[0]);
      const res = await req.post(`/${org.id}/cancel`);

      expectNoErrors(res);

      const accessRequestsAfter = await AccessRequest.find({
        where: { org },
        relations: ['user'],
      });
      expect(accessRequestsAfter).to.have.lengthOf(accessRequestsBefore.length - 1);
      const accessRequestsAfterEdipis = accessRequestsAfter.map(x => x.user!.edipi);
      expect(accessRequestsAfterEdipis).not.to.include(users[0].edipi);
    });

  });

  describe(`${basePath}/:orgId/approve : post`, () => {

    it(`adds user to the org and deletes access request`, async () => {
      const users = await seedUsers({ count: 2 });
      const accessRequest = await seedAccessRequest(users[0], org);
      await seedAccessRequest(users[1], org);
      const unit1 = await seedUnit(org);
      await seedUnit(org);
      const unit3 = await seedUnit(org);

      const accessRequestsBefore = await AccessRequest.find({
        where: { org },
      });
      const accessRequestsBeforeIds = accessRequestsBefore.map(x => x.id);
      expect(accessRequestsBeforeIds).to.include(accessRequest.id);

      const orgUsersBefore = await org.getUsers();
      const orgUsersBeforeEdipis = orgUsersBefore.map(x => x.edipi);
      expect(orgUsersBeforeEdipis).not.to.include(users[0].edipi);

      req.setUser(contact);
      const body = {
        requestId: accessRequest.id,
        roleId: roleAdmin.id,
        unitIds: [unit1.id, unit3.id],
        allUnits: false,
      };
      const res = await req.post(`/${org.id}/approve`, body);

      expectNoErrors(res);

      const accessRequestsAfter = await AccessRequest.find({
        where: { org },
      });
      expect(accessRequestsAfter).to.have.lengthOf(accessRequestsBefore.length - 1);
      const accessRequestsAfterIds = accessRequestsAfter.map(x => x.id);
      expect(accessRequestsAfterIds).not.to.include(accessRequest.id);

      const userRole = (await UserRole.findOne({
        relations: ['role', 'role.org', 'units'],
        where: { user: accessRequest.user },
      }))!;
      expect(userRole).to.exist;

      const units = _.sortBy(await userRole.getUnits(), 'id');
      expect(units).to.have.lengthOf(2);
      expect(units[0].id).to.equal(unit1.id);
      expect(units[1].id).to.equal(unit3.id);

      const orgUsersAfter = await org.getUsers();
      expect(orgUsersAfter).to.have.lengthOf(orgUsersBefore.length + 1);
      const orgUsersAfterEdipis = orgUsersAfter.map(x => x.edipi);
      expect(orgUsersAfterEdipis).to.include(users[0].edipi);
    });

    it(`adds user to the org with access to all units and deletes access request`, async () => {
      const users = await seedUsers({ count: 2 });
      const accessRequest = await seedAccessRequest(users[0], org);
      await seedAccessRequest(users[1], org);
      const unit1 = await seedUnit(org);
      const unit2 = await seedUnit(org);
      const unit3 = await seedUnit(org);

      const accessRequestsBefore = await AccessRequest.find({
        where: { org },
      });
      const accessRequestsBeforeIds = accessRequestsBefore.map(x => x.id);
      expect(accessRequestsBeforeIds).to.include(accessRequest.id);

      const orgUsersBefore = await org.getUsers();
      const orgUsersBeforeEdipis = orgUsersBefore.map(x => x.edipi);
      expect(orgUsersBeforeEdipis).not.to.include(users[0].edipi);

      req.setUser(contact);
      const body = {
        requestId: accessRequest.id,
        roleId: roleAdmin.id,
        unitIds: [],
        allUnits: true,
      };
      const res = await req.post(`/${org.id}/approve`, body);

      expectNoErrors(res);

      const accessRequestsAfter = await AccessRequest.find({
        where: { org },
      });
      expect(accessRequestsAfter).to.have.lengthOf(accessRequestsBefore.length - 1);
      const accessRequestsAfterIds = accessRequestsAfter.map(x => x.id);
      expect(accessRequestsAfterIds).not.to.include(accessRequest.id);

      const userRole = (await UserRole.findOne({
        relations: ['role', 'role.org', 'units'],
        where: { user: accessRequest.user },
      }))!;
      expect(userRole).to.exist;

      const units = _.sortBy(await userRole.getUnits(), 'id');
      expect(units).to.have.lengthOf(3);
      expect(units[0].id).to.equal(unit1.id);
      expect(units[1].id).to.equal(unit2.id);
      expect(units[2].id).to.equal(unit3.id);

      const orgUsersAfter = await org.getUsers();
      expect(orgUsersAfter).to.have.lengthOf(orgUsersBefore.length + 1);
      const orgUsersAfterEdipis = orgUsersAfter.map(x => x.edipi);
      expect(orgUsersAfterEdipis).to.include(users[0].edipi);
    });

  });

  describe(`${basePath}/:orgId/deny : post`, () => {

    it(`sets the access request status as denied`, async () => {
      const users = await seedUsers({ count: 2 });
      let accessRequest = await seedAccessRequest(users[0], org);
      await seedAccessRequest(users[1], org);

      expect(accessRequest.status).to.equal(AccessRequestStatus.Pending);

      const orgUsersCountBefore = (await org.getUsers()).length;

      req.setUser(contact);
      const res = await req.post(`/${org.id}/deny`, {
        requestId: accessRequest.id,
      });

      expectNoErrors(res);

      accessRequest = (await AccessRequest.findOne(accessRequest.id))!;
      expect(accessRequest.status).to.equal(AccessRequestStatus.Denied);

      expect((await org.getUsers()).length).to.equal(orgUsersCountBefore);
    });

  });

});
