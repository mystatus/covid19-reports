import { expect } from 'chai';
import {
  seedOrgContactRoles,
  seedOrgContact,
} from '../../util/test-utils/seed';
import { seedOrg } from '../org/org.model.mock';
import { Role } from '../role/role.model';
import { UserRole } from '../user/user-role.model';
import {
  seedUser,
} from '../user/user.model.mock';
import {
  seedAccessRequest,
} from './access-request.mock';
import { AccessRequest } from './access-request.model';

describe(`AccessRequest Model`, () => {

  describe(`cascades on delete`, () => {

    it(`user`, async () => {
      const { org } = await seedOrgContactRoles();
      const user = await seedUser();
      const accessRequest = await seedAccessRequest(user, org);

      const accessRequestExisting = await AccessRequest.findOne(accessRequest.id);
      expect(accessRequestExisting).to.exist;

      await expect(user.remove()).to.be.fulfilled;

      const accessRequestDeleted = await AccessRequest.findOne(accessRequest.id);
      expect(accessRequestDeleted).not.to.exist;
    });

    it(`org`, async () => {
      const { org } = await seedOrgContact();
      const user = await seedUser();
      const accessRequest = await seedAccessRequest(user, org);

      const accessRequestExisting = await AccessRequest.findOne(accessRequest.id);
      expect(accessRequestExisting).to.exist;

      await expect(org.remove()).to.be.fulfilled;

      const accessRequestDeleted = await AccessRequest.findOne(accessRequest.id);
      expect(accessRequestDeleted).not.to.exist;
    });

  });

});
