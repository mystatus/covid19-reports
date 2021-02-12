import { expect } from 'chai';
import { seedOrgContact } from '../../util/test-utils/seed';
import { WorkspaceTemplate } from './workspace-template.model';
import { seedWorkspaceTemplate } from './workspace-template.model.mock';
import { Workspace } from './workspace.model';
import { seedWorkspace } from './workspace.model.mock';

describe(`Workspace Model`, () => {

  describe(`cascades on delete`, () => {

    it(`org`, async () => {
      const { org } = await seedOrgContact();
      const workspaceTemplate = await seedWorkspaceTemplate();
      const workspace = await seedWorkspace(org, workspaceTemplate);

      const workspaceExisting = await Workspace.findOne(workspace.id);
      expect(workspaceExisting).to.exist;

      await expect(org.remove()).to.be.fulfilled;

      const workspaceDeleted = await Workspace.findOne(workspace.id);
      expect(workspaceDeleted).not.to.exist;
    });

  });

  describe(`sets null on delete`, () => {

    it(`workspaceTemplate`, async () => {
      const { org } = await seedOrgContact();
      const workspaceTemplate = await seedWorkspaceTemplate();
      let workspace = await seedWorkspace(org, workspaceTemplate);

      workspace = (await Workspace.findOne(workspace.id, {
        relations: ['workspaceTemplate'],
      }))!;
      expect(workspace.workspaceTemplate).to.exist;

      await expect(workspaceTemplate.remove()).to.be.fulfilled;

      workspace = (await Workspace.findOne(workspace.id, {
        relations: ['workspaceTemplate'],
      }))!;
      expect(workspace.workspaceTemplate).to.be.null;
    });

  });

});

// HACK: Workaround for tsconfig "isolatedModules"
export const dummy = 0;
