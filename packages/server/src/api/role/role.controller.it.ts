import { expect } from 'chai';
import {
  AddRoleBody,
  UpdateRoleBody,
} from '@covid19-reports/shared';
import { expectNoErrors } from '../../util/test-utils/expect';
import { seedOrgContactRoles } from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import { uniqueString } from '../../util/test-utils/unique';
import { Role } from './role.model';
import { seedRoleBasicUser } from './role.model.mock';

describe(`Role Controller`, () => {
  const basePath = '/api/role';
  let req: TestRequest;

  beforeEach(() => {
    req = new TestRequest(basePath);
  });

  describe(`${basePath}/:orgId : get`, () => {
    it(`gets the org's roles`, async () => {
      const { org, contact, roleAdmin, roleUser } = await seedOrgContactRoles();

      req.setUser(contact);
      const res = await req.get(`/${org.id}`);

      expectNoErrors(res);
      expect(res.data).to.be.array();
      expect(res.data).to.have.lengthOf(2);
      const dataRoleIds = res.data.map((x: Role) => x.id);
      expect(dataRoleIds).to.include.members([roleAdmin.id, roleUser.id]);
    });
  });

  describe(`${basePath}/:orgId : post`, () => {
    it(`adds a role to the org`, async () => {
      const { org, contact } = await seedOrgContactRoles();

      const rolesCountBefore = await Role.count();

      req.setUser(contact);
      const roleData = {
        name: uniqueString(),
        description: uniqueString(),
        allowedRosterColumns: [],
        allowedNotificationEvents: [],
        canManageGroup: true,
        canManageRoster: true,
        canViewRoster: true,
        canViewMuster: true,
        canViewPII: true,
        canViewPHI: true,
      };
      const body: AddRoleBody = {
        ...roleData,
      };
      const res = await req.post(`/${org.id}`, body);

      expectNoErrors(res);

      const roleId = res.data.id;
      const roleAfter = (await Role.findOne(roleId))!;
      expect(roleAfter).to.exist;
      expect(roleAfter).to.containSubset(roleData);

      expect(await Role.count()).to.equal(rolesCountBefore + 1);
    });
  });

  describe(`${basePath}/:orgId/:roleId : get`, () => {
    it(`gets the role`, async () => {
      const { org, contact, roleAdmin } = await seedOrgContactRoles();

      req.setUser(contact);
      const res = await req.get(`/${org.id}/${roleAdmin.id}`);

      expectNoErrors(res);
      expect(res.data).to.containSubset({
        id: roleAdmin.id,
        name: roleAdmin.name,
        description: roleAdmin.description,
      });
    });
  });

  describe(`${basePath}/:orgId/:roleId : delete`, () => {
    it(`deletes the role`, async () => {
      const { org, contact, roleUser } = await seedOrgContactRoles();

      const roleBefore = await Role.findOne(roleUser.id);
      expect(roleBefore).to.exist;

      const rolesCountBefore = await Role.count();

      req.setUser(contact);
      const res = await req.delete(`/${org.id}/${roleUser.id}`);

      expectNoErrors(res);

      const roleAfter = await Role.findOne(roleUser.id);
      expect(roleAfter).not.to.exist;

      expect(await Role.count()).to.equal(rolesCountBefore - 1);
    });
  });

  describe(`${basePath}/:orgId/:roleId : put`, () => {
    it(`updates the role`, async () => {
      const { org, contact } = await seedOrgContactRoles();
      const role = await seedRoleBasicUser(org);

      req.setUser(contact);
      const updateRoleData = {
        name: uniqueString(),
        description: uniqueString(),
        allowedRosterColumns: [],
        allowedNotificationEvents: [],
        canManageGroup: true,
        canManageRoster: true,
        canViewRoster: true,
        canViewMuster: true,
        canViewPII: true,
        canViewPHI: true,
      };
      const body: UpdateRoleBody = {
        ...updateRoleData,
      };
      const res = await req.put(`/${org.id}/${role.id}`, body);

      expectNoErrors(res);
      expect(res.data).to.containSubset({
        id: role.id,
      });

      const roleAfter = (await Role.findOne(role.id))!;
      expect(roleAfter).to.exist;
      expect(roleAfter).to.containSubset(updateRoleData);
    });
  });
});
