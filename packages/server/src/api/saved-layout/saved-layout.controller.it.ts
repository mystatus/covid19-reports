import { expect } from 'chai';
import {
  EntityType,
  GetSavedLayoutsQuery,
  SavedLayoutData,
  SavedLayoutSerialized,
} from '@covid19-reports/shared';
import {
  expectError,
  expectNoErrors,
} from '../../util/test-utils/expect';
import { seedOrgContactRoles } from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { User } from '../user/user.model';
import { SavedLayout } from './saved-layout.model';
import {
  seedSavedLayout,
  seedSavedLayouts,
} from './saved-layout.model.mock';

describe(`SavedLayout Controller`, () => {
  const basePath = '/api/saved-layout';
  let req: TestRequest;
  let org: Org;
  let contact: User;

  beforeEach(async () => {
    ({ org, contact } = await seedOrgContactRoles());
    req = new TestRequest(basePath);
    req.setUser(contact);
  });

  describe(`${basePath}/:orgId : get`, () => {
    it(`gets the org's saved layouts`, async () => {
      const savedLayouts = await seedSavedLayouts(org, { count: 2 });

      const res = await req.get(`/${org.id}`);
      const data = res.data as SavedLayoutSerialized[];

      expectNoErrors(res);
      expect(data).to.be.array();
      expect(data).to.have.lengthOf(savedLayouts.length);
      const dataIds = data.map(x => x.id);
      expect(dataIds).to.include(savedLayouts[0].id);
      expect(dataIds).to.include(savedLayouts[1].id);
    });

    it(`gets the org's saved layouts by entity type`, async () => {
      const rosterEntitySavedLayouts = await seedSavedLayouts(org, {
        count: 2,
        customData: {
          entityType: EntityType.RosterEntry,
        },
      });

      await seedSavedLayouts(org, {
        count: 2,
        customData: {
          entityType: EntityType.Observation,
        },
      });

      const query: GetSavedLayoutsQuery = {
        entityType: EntityType.RosterEntry,
      };

      const res = await req.get(`/${org.id}`, {
        params: query,
      });
      const data = res.data as SavedLayoutSerialized[];

      expectNoErrors(res);
      expect(data).to.be.array();
      expect(data).to.have.lengthOf(rosterEntitySavedLayouts.length);
      const dataIds = data.map(x => x.id);
      expect(dataIds).to.include(rosterEntitySavedLayouts[0].id);
      expect(dataIds).to.include(rosterEntitySavedLayouts[1].id);
    });
  });

  describe(`${basePath}/:orgId : post`, () => {
    it(`adds a saved layout to the org`, async () => {
      const savedLayoutCountBefore = await SavedLayout.count();
      const orgSavedLayoutCountBefore = await SavedLayout.count({
        where: { org },
      });

      const body: SavedLayoutData = {
        name: uniqueString(),
        entityType: EntityType.RosterEntry,
        config: {},
      };

      const res = await req.post(`/${org.id}`, body);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'id',
        'name',
        'entityType',
        'org',
        'config',
      ]);
      const savedLayoutId = res.data.id;

      const savedLayoutAfter = (await SavedLayout.findOne(savedLayoutId, {
        relations: ['org'],
      }))!;
      expect(savedLayoutAfter).to.exist;
      expect(savedLayoutAfter.name).to.eql(body.name);
      expect(savedLayoutAfter.org).to.exist;
      expect(savedLayoutAfter.org!.id).to.eql(org.id);
      expect(savedLayoutAfter.config).to.eql(body.config);

      expect(await SavedLayout.count()).to.eql(savedLayoutCountBefore + 1);
      const orgSavedLayoutCountAfter = await SavedLayout.count({
        where: { org },
      });
      expect(orgSavedLayoutCountAfter).to.eql(orgSavedLayoutCountBefore + 1);
    });

    it(`fails if missing required body data`, async () => {
      const body = {
        config: {},
      };

      const res = await req.post(`/${org.id}`, body);

      expectError(res, 'Missing required request body params: name, entityType');
    });
  });

  describe(`${basePath}/:orgId/:savedLayoutId : put`, () => {
    it(`updates the org's saved layout`, async () => {
      const savedLayout = await seedSavedLayout(org);

      const body: SavedLayoutData = {
        name: uniqueString(),
        entityType: EntityType.Observation,
        config: {},
      };

      const res = await req.put(`/${org.id}/${savedLayout.id}`, body);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'id',
        'name',
        'entityType',
        'config',
      ]);
      expect(res.data.id).to.eql(savedLayout.id);

      const savedLayoutAfter = (await SavedLayout.findOne(savedLayout.id))!;
      expect(savedLayoutAfter.name).to.eql(body.name);
      expect(savedLayoutAfter.config).to.eql(body.config);
    });
  });

  describe(`${basePath}/:orgId/:savedLayoutId : delete`, () => {
    it(`deletes the org's saved layout`, async () => {
      const savedLayouts = await seedSavedLayouts(org, { count: 2 });

      const savedLayoutCountBefore = await SavedLayout.count();

      const savedLayoutBefore = await SavedLayout.findOne(savedLayouts[0].id);
      expect(savedLayoutBefore).to.exist;

      const res = await req.delete(`/${org.id}/${savedLayouts[0].id}`);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'name',
        'entityType',
        'config',
      ]);

      expect(await SavedLayout.count()).to.eql(savedLayoutCountBefore - 1);

      const savedLayoutAfter = await SavedLayout.findOne(savedLayouts[0].id);
      expect(savedLayoutAfter).not.to.exist;
    });
  });
});
