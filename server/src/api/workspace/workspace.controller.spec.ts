import { expect } from 'chai';
import { stub } from 'sinon';
import {
  AddWorkspaceBody,
  UpdateWorkspaceBody,
} from '@covid19-reports/shared';
import { KibanaApi } from '../../kibana/kibana-api';
import * as kibanaUtility from '../../kibana/kibana-utility';
import { expectNoErrors } from '../../util/test-utils/expect';
import {
  seedOrgContact,
  seedOrgContactRoles,
} from '../../util/test-utils/seed';
import { Stub } from '../../util/test-utils/stub';
import { TestRequest } from '../../util/test-utils/test-request';
import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { User } from '../user/user.model';
import { WorkspaceTemplate } from './workspace-template.model';
import {
  seedWorkspaceTemplate,
  seedWorkspaceTemplates,
} from './workspace-template.model.mock';
import { Workspace } from './workspace.model';
import { seedWorkspaces } from './workspace.model.mock';

describe(`Workspace Controller`, () => {

  const basePath = `/api/workspace`;
  let req: TestRequest;
  let org: Org;
  let contact: User;
  let setupKibanaWorkspaceStub: Stub<typeof kibanaUtility['setupKibanaWorkspace']>;
  let kibanaApiConnectStub: Stub<typeof KibanaApi['connect']>;

  beforeEach(async () => {
    ({ org, contact } = await seedOrgContactRoles());
    req = new TestRequest(basePath);
    req.setUser(contact);
    kibanaApiConnectStub = stub(KibanaApi, 'connect');
    setupKibanaWorkspaceStub = stub(kibanaUtility, 'setupKibanaWorkspace');
  });

  afterEach(() => {
    kibanaApiConnectStub.restore();
    setupKibanaWorkspaceStub.restore();
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

  describe(`${basePath}/:orgId/templates : get`, () => {

    it(`gets workspace templates`, async () => {
      const workspaceTemplates = await seedWorkspaceTemplates({ count: 2 });

      const res = await req.get(`/${org.id}/templates`);

      expectNoErrors(res);
      expect(res.data).to.be.array();
      expect(res.data).to.have.lengthOf(workspaceTemplates.length);
      expect(res.data[0]).to.include.keys([
        'id',
        'name',
        'description',
        'pii',
        'phi',
      ]);
      const dataIds = res.data.map((x: WorkspaceTemplate) => x.id);
      expect(dataIds).to.include(workspaceTemplates[0].id);
      expect(dataIds).to.include(workspaceTemplates[1].id);
    });

  });

  describe(`${basePath}/:orgId : post`, () => {

    it(`adds a workspace to the org`, async () => {
      const workspaceTemplate = await seedWorkspaceTemplate();

      const workspaceCountBefore = await Workspace.count();
      const orgWorkspaceCountBefore = await Workspace.count({
        where: { org: org.id },
      });

      const body: AddWorkspaceBody = {
        name: uniqueString(),
        description: uniqueString(),
        templateId: workspaceTemplate.id,
      };

      const res = await req.post(`/${org.id}`, body, {
        headers: {},
      });

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'id',
        'name',
        'description',
        'org',
        'pii',
        'phi',
        'workspaceTemplate',
      ]);

      expect(await Workspace.count()).to.eql(workspaceCountBefore + 1);

      const orgWorkspaceCountAfter = await Workspace.count({
        where: { org: org.id },
      });
      expect(orgWorkspaceCountAfter).to.eql(orgWorkspaceCountBefore + 1);

      expect(setupKibanaWorkspaceStub.callCount).to.eql(1);
    });

  });

  describe(`${basePath}/:orgId/:workspaceId : get`, () => {

    it(`gets the specified workspace`, async () => {
      const template = await seedWorkspaceTemplate();
      const workspaces = await seedWorkspaces(org, template, { count: 2 });

      const res = await req.get(`/${org.id}/${workspaces[0].id}`);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'id',
        'name',
        'description',
        'pii',
        'phi',
      ]);
      expect(res.data.id).to.eql(workspaces[0].id);
    });

  });

  describe(`${basePath}/:orgId/:workspaceId : delete`, () => {

    it(`deletes the specified workspace`, async () => {
      const template = await seedWorkspaceTemplate();
      const workspaces = await seedWorkspaces(org, template, { count: 2 });

      const workspaceCountBefore = await Workspace.count();

      const workspaceBefore = await Workspace.findOne(workspaces[0].id);
      expect(workspaceBefore).to.exist;

      const res = await req.delete(`/${org.id}/${workspaces[0].id}`);

      expectNoErrors(res);

      expect(await Workspace.count()).to.eql(workspaceCountBefore - 1);

      const workspaceAfter = await Workspace.findOne(workspaces[0].id);
      expect(workspaceAfter).not.to.exist;
    });

  });

  describe(`${basePath}/:orgId/:workspaceId : put`, () => {

    it(`updates the specified workspace`, async () => {
      const template = await seedWorkspaceTemplate();
      const workspaces = await seedWorkspaces(org, template, { count: 2 });

      const body: UpdateWorkspaceBody = {
        name: uniqueString(),
        description: uniqueString(),
      };

      const res = await req.put(`/${org.id}/${workspaces[0].id}`, body);

      expectNoErrors(res);

      const workspaceAfter = (await Workspace.findOne(workspaces[0].id))!;
      expect(workspaceAfter.name).to.eql(body.name);
      expect(workspaceAfter.description).to.eql(body.description);
    });

  });

});
