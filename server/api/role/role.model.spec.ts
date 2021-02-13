import { expect } from 'chai';
import {
  seedOrgContact,
} from '../../util/test-utils/seed';
import { seedWorkspaceTemplate } from '../workspace/workspace-template.model.mock';
import { seedWorkspace } from '../workspace/workspace.model.mock';
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

  describe(`restricts on delete`, () => {

    it(`workspace`, async () => {
      const { org } = await seedOrgContact();
      const workspaceTemplate = await seedWorkspaceTemplate();
      const workspace = await seedWorkspace(org, workspaceTemplate);
      const role = await seedRoleAdmin(org, workspace);

      let roleExisting = await Role.findOne(role.id);
      expect(roleExisting).to.exist;

      await expect(workspace.remove()).to.be.rejected;

      roleExisting = await Role.findOne(role.id);
      expect(roleExisting).to.exist;
    });

  });

});
