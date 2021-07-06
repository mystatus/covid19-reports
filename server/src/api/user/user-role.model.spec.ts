import { expect } from 'chai';
import { seedOrgContactRoles } from '../../util/test-utils/seed';
import { UserRole } from './user-role.model';
import { seedUserRole } from './user-role.model.mock';
import { seedUser } from './user.model.mock';

describe(`UserRole Model`, () => {

  describe(`cascades on delete`, () => {

    it(`user`, async () => {
      const { roleUser } = await seedOrgContactRoles();
      const user = await seedUser();
      const userRole = await seedUserRole(user, roleUser);

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
      await seedUserRole(user, roleUser);

      await expect(roleUser.remove()).to.be.rejected;

      const userRoles = await UserRole.find({
        where: { role: roleUser },
      });
      await UserRole.remove(userRoles);

      await expect(roleUser.remove()).to.be.fulfilled;
    });

  });

});
