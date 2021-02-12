import { expect } from 'chai';
import { seedOrgContactRoles } from '../../util/test-utils/seed';
import { addUserToOrg } from '../org/org.model.mock';
import { UserRole } from './user-role.model';
import { seedUser } from './user.model.mock';

describe(`UserRole Model`, () => {

  describe(`cascades on delete`, () => {

    it(`user`, async () => {
      const { roleUser } = await seedOrgContactRoles();
      const user = await seedUser();
      const userRole = await addUserToOrg(user, roleUser);

      const userRoleExisting = await UserRole.findOne(userRole.id);
      expect(userRoleExisting).to.exist;

      await expect(user.remove()).to.be.fulfilled;

      const userRoleDeleted = await UserRole.findOne(userRole.id);
      expect(userRoleDeleted).not.to.exist;
    });

  });

  describe(`restricts on delete`, () => {

    it(`role`, async () => {
      const { roleUser } = await seedOrgContactRoles();
      const user = await seedUser();
      await addUserToOrg(user, roleUser);

      await expect(roleUser.remove()).to.be.rejected;

      const userRoles = await UserRole.find({
        where: { role: roleUser },
      });
      await UserRole.remove(userRoles);

      await expect(roleUser.remove()).to.be.fulfilled;
    });

  });

});

// HACK: Workaround for tsconfig "isolatedModules"
export const dummy = 0;
