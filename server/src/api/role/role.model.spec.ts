import { expect } from 'chai';
import { seedOrgContact } from '../../util/test-utils/seed';
import { Role } from './role.model';
import { seedRoleAdmin } from './role.model.mock';

describe(`Role Model`, () => {

  describe(`cascades on delete`, () => {

    it(`org`, async () => {
      const { org } = await seedOrgContact();
      const role = await seedRoleAdmin(org);

      const roleExisting = await Role.findOne(role.id);
      expect(roleExisting).to.exist;

      await expect(org.remove()).to.be.fulfilled;

      const roleDeleted = await Role.findOne(role.id);
      expect(roleDeleted).not.to.exist;
    });

  });

});
