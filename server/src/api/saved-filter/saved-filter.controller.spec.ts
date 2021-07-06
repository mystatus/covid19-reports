import { expect } from 'chai';
import { stub } from 'sinon';
import { elasticsearch } from '../../elasticsearch/elasticsearch';
import { expectError, expectNoErrors } from '../../util/test-utils/expect';
import {
  seedOrgContactRoles,
} from '../../util/test-utils/seed';
import { Stub } from '../../util/test-utils/stub';
import { TestRequest } from '../../util/test-utils/test-request';
import {
  uniqueString,
} from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { User } from '../user/user.model';
import { SavedFilterData } from './saved-filter.controller';
import { EntityType, SavedFilter } from './saved-filter.model';
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

    it(`gets the org's savedFilters`, async () => {
      const savedFilters = await seedSavedFilters(org, { count: 2 });

      const res = await req.get(`/${org.id}`);

      expectNoErrors(res);
      expect(res.data).to.be.array();
      expect(res.data).to.have.lengthOf(savedFilters.length);
      const dataIds = res.data.map((x: SavedFilter) => x.id);
      expect(dataIds).to.include(savedFilters[0].id);
      expect(dataIds).to.include(savedFilters[1].id);
    });

  });

  describe(`${basePath}/:orgId : post`, () => {

    it(`adds a savedFilter to the org`, async () => {
      const savedFilterCountBefore = await SavedFilter.count();
      const orgSavedFilterCountBefore = await SavedFilter.count({
        where: { org },
      });

      const body: SavedFilterData = {
        name: uniqueString(),
        entityType: EntityType.RosterEntry,
        filterConfiguration: {},
      };

      const res = await req.post(`/${org.id}`, body);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'id',
        'name',
        'entityType',
        'org',
        'filterConfiguration',
      ]);
      const savedFilterId = res.data.id;

      const savedFilterAfter = (await SavedFilter.findOne(savedFilterId, {
        relations: ['org'],
      }))!;
      expect(savedFilterAfter).to.exist;
      expect(savedFilterAfter.name).to.eql(body.name);
      expect(savedFilterAfter.org).to.exist;
      expect(savedFilterAfter.org!.id).to.eql(org.id);
      expect(savedFilterAfter.filterConfiguration).to.eql(body.filterConfiguration);

      expect(await SavedFilter.count()).to.eql(savedFilterCountBefore + 1);
      const orgSavedFilterCountAfter = await SavedFilter.count({
        where: { org },
      });
      expect(orgSavedFilterCountAfter).to.eql(orgSavedFilterCountBefore + 1);
    });

  });

  describe(`${basePath}/:orgId/:savedFilterId : put`, () => {

    let elasticsearchUpdateByQueryStub: Stub<typeof elasticsearch['updateByQuery']>;

    beforeEach(() => {
      elasticsearchUpdateByQueryStub = stub(elasticsearch, 'updateByQuery');
    });

    afterEach(() => {
      elasticsearchUpdateByQueryStub.restore();
    });

    it(`updates the org's savedFilter`, async () => {
      const savedFilter = await seedSavedFilter(org);

      const body: SavedFilterData = {
        name: uniqueString(),
        entityType: EntityType.Observation,
        filterConfiguration: {},
      };

      const res = await req.put(`/${org.id}/${savedFilter.id}`, body);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'id',
        'name',
        'entityType',
        'org',
        'filterConfiguration',
      ]);
      expect(res.data.id).to.eql(savedFilter.id);

      const savedFilterAfter = (await SavedFilter.findOne(savedFilter.id))!;
      expect(savedFilterAfter.name).to.eql(body.name);
      expect(savedFilterAfter.filterConfiguration).to.eql(body.filterConfiguration);

      expect(elasticsearchUpdateByQueryStub.callCount).to.eql(1);
    });

    it(`throws an error if the muster configuration is missing a report ID`, async () => {
      const savedFilter = await seedSavedFilter(org);

      const body = {
        name: uniqueString(),
        filterConfiguration: {},
      } as SavedFilterData;

      const res = await req.put(`/${org.id}/${savedFilter.id}`, body);

      expectError(res, 'Unrecognized report type');
    });

  });

  describe(`${basePath}/:orgId/:savedFilterId : delete`, () => {

    it(`deletes the org's savedFilter`, async () => {
      const savedFilters = await seedSavedFilters(org, { count: 2 });

      const savedFilterCountBefore = await SavedFilter.count();

      const savedFilterBefore = await SavedFilter.findOne(savedFilters[0].id);
      expect(savedFilterBefore).to.exist;

      const res = await req.delete(`/${org.id}/${savedFilters[0].id}`);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'name',
        'org',
        'entityType',
        'filterConfiguration',
      ]);

      expect(await SavedFilter.count()).to.eql(savedFilterCountBefore - 1);

      const savedFilterAfter = await SavedFilter.findOne(savedFilters[0].id);
      expect(savedFilterAfter).not.to.exist;
    });

  });

  // describe(`${basePath}/:orgId/:savedFilterId/roster : get`, () => {

  //   it(`gets the roster for the org's savedFilter as it existed at the specified timestamp`, async () => {
  //     const userInternal = await seedUserInternal();
  //     const { org: otherOrg } = await seedOrgContact();
  //     const savedFilters = await seedSavedFilters(org, { count: 2 });
  //     const otherOrgSavedFilter = await seedSavedFilter(otherOrg);
  //     await seedRosterEntries(savedFilters[0], { count: 4 });
  //     await seedRosterEntries(savedFilters[1], { count: 2 });
  //     const otherOrgSavedFilterRosterEntries = await seedRosterEntries(otherOrgSavedFilter, { count: 2 });

  //     // Manually set the timestamps in the roster history to keep things consistent.
  //     const savedFilter0RosterHistory = await RosterHistory.find({
  //       where: { savedFilter: savedFilters[0].id },
  //     });

  //     let ms = 1000;
  //     for (const historyEntry of savedFilter0RosterHistory) {
  //       historyEntry.timestamp = moment.utc(ms).toDate();
  //       await historyEntry.save();
  //       ms += 1000;
  //     }

  //     const timestampSeconds = 2;

  //     const savedFilter1RosterHistory = await RosterHistory.find({
  //       where: { savedFilter: savedFilters[1].id },
  //     });

  //     for (const historyEntry of savedFilter1RosterHistory) {
  //       historyEntry.timestamp = new Date(ms);
  //       await historyEntry.save();
  //       ms += 1;
  //     }

  //     const otherOrgSavedFilterRosterHistory = await RosterHistory.find({
  //       where: { firstName: In(otherOrgSavedFilterRosterEntries.map(x => x.firstName)) },
  //     });

  //     for (const historyEntry of otherOrgSavedFilterRosterHistory) {
  //       historyEntry.timestamp = new Date(ms);
  //       await historyEntry.save();
  //       ms += 1;
  //     }

  //     req.setUser(userInternal);
  //     const res = await req.get(`/${org.id}/${savedFilters[0].id}/roster?timestamp=${timestampSeconds}`);

  //     expectNoErrors(res);
  //     expect(res.data).to.be.array();
  //     expect(res.data).to.have.lengthOf(2);
  //   });

  // });

});
