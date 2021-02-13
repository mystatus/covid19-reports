import { expect } from 'chai';
import { expectNoErrors } from '../../util/test-utils/expect';
import {
  seedOrgContactRoles,
  seedOrgContact,
} from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import { uniqueString } from '../../util/test-utils/unique';
import { seedUser } from '../user/user.model.mock';
import { Org } from './org.model';
import { addUserToOrg } from './org.model.mock';

describe(`Org Controller`, () => {

  const basePath = '/api/org';
  let req: TestRequest;

  beforeEach(() => {
    req = new TestRequest(basePath);
  });

  describe(`${basePath} : get`, () => {

    it(`gets list of all orgs`, async () => {
      const { org: org1 } = await seedOrgContact();
      const { org: org2 } = await seedOrgContact();
      const user = await seedUser();

      req.setUser(user);
      const res = await req.get('/');

      expectNoErrors(res);
      expect(res.data).to.be.array();
      expect(res.data).to.have.lengthOf(2);
      const orgIds = res.data.map((x: Org) => x.id);
      expect(orgIds).to.include.members([org1.id, org2.id]);
    });

  });

  describe(`${basePath}/:orgId : get`, () => {

    it(`gets the org`, async () => {
      const { org } = await seedOrgContact();
      const user = await seedUser({ rootAdmin: true });

      req.setUser(user);
      const res = await req.get(`/${org.id}`);

      expectNoErrors(res);
      expect(res.data).to.containSubset({
        id: org.id,
        name: org.name,
        description: org.description,
        indexPrefix: org.indexPrefix,
        defaultMusterConfiguration: org.defaultMusterConfiguration,
      });
    });

  });

  describe(`${basePath}/:orgId : delete`, () => {

    it(`deletes the org`, async () => {
      const { org } = await seedOrgContact();
      await seedOrgContact();
      const user = await seedUser({ rootAdmin: true });

      const orgBefore = await Org.findOne(org.id);
      expect(orgBefore).to.exist;

      const orgsCountBefore = await Org.count();

      req.setUser(user);
      const res = await req.delete(`/${org.id}`);

      expectNoErrors(res);

      const orgAfter = await Org.findOne(org.id);
      expect(orgAfter).not.to.exist;

      expect(await Org.count()).to.equal(orgsCountBefore - 1);
    });

  });

  describe(`${basePath}/:orgId : put`, () => {

    it(`updates the org`, async () => {
      const { org } = await seedOrgContact();
      const user = await seedUser({ rootAdmin: true });

      const orgBefore = (await Org.findOne(org.id))!;
      expect(orgBefore.name).to.equal(org.name);
      expect(orgBefore.description).to.equal(org.description);

      req.setUser(user);
      const body = {
        name: uniqueString(),
        description: uniqueString(),
      };
      const res = await req.put(`/${org.id}`, body);

      expectNoErrors(res);

      const orgAfter = (await Org.findOne(org.id))!;
      expect(orgAfter.name).to.equal(body.name);
      expect(orgAfter.description).to.equal(body.description);
    });

  });

  describe(`${basePath} : post`, () => {

    it(`adds an org`, async () => {
      const user = await seedUser({ rootAdmin: true });
      const contact = await seedUser();

      const orgsCountBefore = await Org.count();

      req.setUser(user);
      const body = {
        name: uniqueString(),
        description: uniqueString(),
        contactEdipi: contact.edipi,
      };
      const res = await req.post('/', body);

      expectNoErrors(res);
      expect(res.data.id).to.exist;
      const orgId = res.data.id;

      const orgAfter = (await Org.findOne(orgId, {
        relations: ['contact'],
      }))!;
      expect(orgAfter).to.exist;
      expect(orgAfter).to.containSubset({
        name: body.name,
        description: body.description,
      });
      expect(orgAfter.contact).to.containSubset({
        edipi: contact.edipi,
      });

      expect(await Org.count()).to.equal(orgsCountBefore + 1);
    });

  });

  describe(`${basePath}/:orgId/default-muster : put`, () => {

    it(`updates the org's default muster configuration`, async () => {
      const { org, roleAdmin } = await seedOrgContactRoles();
      const user = await seedUser();
      await addUserToOrg(user, roleAdmin);

      const orgBefore = (await Org.findOne(org.id))!;
      expect(orgBefore.defaultMusterConfiguration).to.eql(org.defaultMusterConfiguration);

      req.setUser(user);
      const body = {
        defaultMusterConfiguration: [uniqueString(), uniqueString()],
      };
      const res = await req.put(`/${org.id}/default-muster`, body);

      expectNoErrors(res);

      const orgAfter = (await Org.findOne(org.id))!;
      expect(orgAfter.defaultMusterConfiguration).to.eql(body.defaultMusterConfiguration);
    });

  });

});
