import { expect } from 'chai';
import {
  EntityType,
  GetSavedFiltersQuery,
  SavedFilterData,
  SavedFilterSerialized,
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
import { SavedFilter } from './saved-filter.model';
import {
  seedSavedFilter,
  seedSavedFilters,
} from './saved-filter.model.mock';

describe(`SavedFilter Controller`, () => {
  const basePath = '/api/saved-filter';
  let req: TestRequest;
  let org: Org;
  let contact: User;

  beforeEach(async () => {
    ({ org, contact } = await seedOrgContactRoles());
    req = new TestRequest(basePath);
    req.setUser(contact);
  });

  describe(`${basePath}/:orgId : get`, () => {
    it(`gets the org's saved filters`, async () => {
      const savedFilters = await seedSavedFilters(org, { count: 2 });

      const res = await req.get(`/${org.id}`);
      const data = res.data as SavedFilterSerialized[];

      expectNoErrors(res);
      expect(data).to.be.array();
      expect(data).to.have.lengthOf(savedFilters.length);
      const dataIds = data.map(x => x.id);
      expect(dataIds).to.include(savedFilters[0].id);
      expect(dataIds).to.include(savedFilters[1].id);
    });

    it(`gets the org's saved filters by entity type`, async () => {
      const rosterEntitySavedFilters = await seedSavedFilters(org, {
        count: 2,
        customData: {
          entityType: EntityType.RosterEntry,
        },
      });

      await seedSavedFilters(org, {
        count: 2,
        customData: {
          entityType: EntityType.Observation,
        },
      });

      const query: GetSavedFiltersQuery = {
        entityType: EntityType.RosterEntry,
      };

      const res = await req.get(`/${org.id}`, {
        params: query,
      });
      const data = res.data as SavedFilterSerialized[];

      expectNoErrors(res);
      expect(data).to.be.array();
      expect(data).to.have.lengthOf(rosterEntitySavedFilters.length);
      const dataIds = data.map(x => x.id);
      expect(dataIds).to.include(rosterEntitySavedFilters[0].id);
      expect(dataIds).to.include(rosterEntitySavedFilters[1].id);
    });
  });

  describe(`${basePath}/:orgId : post`, () => {
    it(`adds a saved filter to the org`, async () => {
      const savedFilterCountBefore = await SavedFilter.count();
      const orgSavedFilterCountBefore = await SavedFilter.count({
        where: { org },
      });

      const body: SavedFilterData = {
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
      const savedFilterId = res.data.id;

      const savedFilterAfter = (await SavedFilter.findOne(savedFilterId, {
        relations: ['org'],
      }))!;
      expect(savedFilterAfter).to.exist;
      expect(savedFilterAfter.name).to.eql(body.name);
      expect(savedFilterAfter.org).to.exist;
      expect(savedFilterAfter.org!.id).to.eql(org.id);
      expect(savedFilterAfter.config).to.eql(body.config);

      expect(await SavedFilter.count()).to.eql(savedFilterCountBefore + 1);
      const orgSavedFilterCountAfter = await SavedFilter.count({
        where: { org },
      });
      expect(orgSavedFilterCountAfter).to.eql(orgSavedFilterCountBefore + 1);
    });

    it(`fails if missing required body data`, async () => {
      const body = {
        config: {},
      };

      const res = await req.post(`/${org.id}`, body);

      expectError(res, 'Missing required request body params: name, entityType');
    });
  });

  describe(`${basePath}/:orgId/:savedFilterId : put`, () => {
    it(`updates the org's saved filter`, async () => {
      const savedFilter = await seedSavedFilter(org);

      const body: SavedFilterData = {
        name: uniqueString(),
        entityType: EntityType.Observation,
        config: {},
      };

      const res = await req.put(`/${org.id}/${savedFilter.id}`, body);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'id',
        'name',
        'entityType',
        'config',
      ]);
      expect(res.data.id).to.eql(savedFilter.id);

      const savedFilterAfter = (await SavedFilter.findOne(savedFilter.id))!;
      expect(savedFilterAfter.name).to.eql(body.name);
      expect(savedFilterAfter.config).to.eql(body.config);
    });
  });

  describe(`${basePath}/:orgId/:savedFilterId : delete`, () => {
    it(`deletes the org's saved filter`, async () => {
      const savedFilters = await seedSavedFilters(org, { count: 2 });

      const savedFilterCountBefore = await SavedFilter.count();

      const savedFilterBefore = await SavedFilter.findOne(savedFilters[0].id);
      expect(savedFilterBefore).to.exist;

      const res = await req.delete(`/${org.id}/${savedFilters[0].id}`);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'name',
        'entityType',
        'config',
      ]);

      expect(await SavedFilter.count()).to.eql(savedFilterCountBefore - 1);

      const savedFilterAfter = await SavedFilter.findOne(savedFilters[0].id);
      expect(savedFilterAfter).not.to.exist;
    });
  });
});
