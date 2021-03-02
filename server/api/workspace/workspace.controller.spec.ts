import { expect } from 'chai';
import { expectNoErrors } from '../../util/test-utils/expect';
import {
  seedOrgContact,
  seedOrgContactRoles,
} from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import { Org } from '../org/org.model';
import { User } from '../user/user.model';
import { seedWorkspaceTemplate } from './workspace-template.model.mock';
import { Workspace } from './workspace.model';
import { seedWorkspaces } from './workspace.model.mock';

describe(`Workspace Controller`, () => {

  const basePath = `/api/workspace`;
  let req: TestRequest;
  let org: Org;
  let contact: User;

  beforeEach(async () => {
    ({ org, contact } = await seedOrgContactRoles());
    req = new TestRequest(basePath);
    req.setUser(contact);
  });

  describe(`${basePath}/:orgId : get`, () => {

    it(`gets the org's workspaces`, async () => {
      const workspaceTemplate = await seedWorkspaceTemplate();
      const { org: otherOrg } = await seedOrgContact();
      await seedWorkspaces(otherOrg, workspaceTemplate, { count: 2 });
      const workspaces = await seedWorkspaces(org, workspaceTemplate, { count: 2 });

      const res = await req.get(`/${org.id}`);

      expectNoErrors(res);
      expect(res.data).to.be.array();
      expect(res.data).to.have.lengthOf(workspaces.length);
      expect(res.data[0]).to.include.keys([
        'id',
        'name',
        'description',
        'pii',
        'phi',
        'workspaceTemplate',
      ]);
      const workspaceIds = res.data.map((x: Workspace) => x.id);
      expect(workspaceIds).to.include(workspaces[0].id);
      expect(workspaceIds).to.include(workspaces[1].id);
    });

  });

  // TODO: /:orgId/templates : get
  // TODO: /:orgId : post
  // TODO: /:orgId/:workspaceId : get
  // TODO: /:orgId/:workspaceId : delete
  // TODO: /:orgId/:workspaceId : put

});
