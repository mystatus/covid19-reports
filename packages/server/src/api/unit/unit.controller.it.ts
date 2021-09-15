import { expect } from 'chai';
import { stub } from 'sinon';
import { In } from 'typeorm';
import moment from 'moment';
import { UnitData } from '@covid19-reports/shared';
import { elasticsearch } from '../../elasticsearch/elasticsearch';
import { expectNoErrors } from '../../util/test-utils/expect';
import {
  seedOrgContact,
  seedOrgContactRoles,
} from '../../util/test-utils/seed';
import { Stub } from '../../util/test-utils/stub';
import { TestRequest } from '../../util/test-utils/test-request';
import {
  uniqueString,
} from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { RosterHistory } from '../roster/roster-history.model';
import { seedRosterEntries } from '../roster/roster.model.mock';
import { User } from '../user/user.model';
import { seedUserInternal } from '../user/user.model.mock';
import { Unit } from './unit.model';
import {
  seedUnit,
  seedUnits,
} from './unit.model.mock';

describe(`Unit Controller`, () => {
  const basePath = '/api/unit';
  let req: TestRequest;
  let org: Org;
  let contact: User;

  beforeEach(async () => {
    ({ org, contact } = await seedOrgContactRoles());
    req = new TestRequest(basePath);
    req.setUser(contact);
  });

  describe(`${basePath}/:orgId : get`, () => {
    it(`gets the org's units`, async () => {
      const units = await seedUnits(org, { count: 2 });

      const res = await req.get(`/${org.id}`);

      expectNoErrors(res);
      expect(res.data).to.be.array();
      expect(res.data).to.have.lengthOf(units.length);
      const dataIds = res.data.map((x: Unit) => x.id);
      expect(dataIds).to.include(units[0].id);
      expect(dataIds).to.include(units[1].id);
    });
  });

  describe(`${basePath}/:orgId : post`, () => {
    it(`adds a unit to the org`, async () => {
      const unitCountBefore = await Unit.count();
      const orgUnitCountBefore = await Unit.count({
        where: { org },
      });

      const body: UnitData = {
        name: uniqueString(),
      };

      const res = await req.post(`/${org.id}`, body);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'id',
        'name',
        'org',
      ]);
      const unitId = res.data.id;

      const unitAfter = (await Unit.findOne(unitId, {
        relations: ['org'],
      }))!;
      expect(unitAfter).to.exist;
      expect(unitAfter.name).to.eql(body.name);
      expect(unitAfter.org).to.exist;
      expect(unitAfter.org!.id).to.eql(org.id);

      expect(await Unit.count()).to.eql(unitCountBefore + 1);
      const orgUnitCountAfter = await Unit.count({
        where: { org },
      });
      expect(orgUnitCountAfter).to.eql(orgUnitCountBefore + 1);
    });
  });

  describe(`${basePath}/:orgId/:unitId : put`, () => {
    let elasticsearchUpdateByQueryStub: Stub<typeof elasticsearch['updateByQuery']>;

    beforeEach(() => {
      elasticsearchUpdateByQueryStub = stub(elasticsearch, 'updateByQuery');
    });

    afterEach(() => {
      elasticsearchUpdateByQueryStub.restore();
    });

    it(`updates the org's unit`, async () => {
      const unit = await seedUnit(org);

      const body: UnitData = {
        name: uniqueString(),
      };

      const res = await req.put(`/${org.id}/${unit.id}`, body);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'id',
        'name',
        'org',
      ]);
      expect(res.data.id).to.eql(unit.id);

      const unitAfter = (await Unit.findOne(unit.id))!;
      expect(unitAfter.name).to.eql(body.name);

      expect(elasticsearchUpdateByQueryStub.callCount).to.eql(1);
    });
  });

  describe(`${basePath}/:orgId/:unitId : delete`, () => {
    it(`deletes the org's unit`, async () => {
      const units = await seedUnits(org, { count: 2 });

      const unitCountBefore = await Unit.count();

      const unitBefore = await Unit.findOne(units[0].id);
      expect(unitBefore).to.exist;

      const res = await req.delete(`/${org.id}/${units[0].id}`);

      expectNoErrors(res);
      expect(res.data).to.include.keys([
        'name',
        'org',
      ]);

      expect(await Unit.count()).to.eql(unitCountBefore - 1);

      const unitAfter = await Unit.findOne(units[0].id);
      expect(unitAfter).not.to.exist;
    });
  });

  describe(`${basePath}/:orgId/:unitId/roster : get`, () => {
    it(`gets the roster for the org's unit as it existed at the specified timestamp`, async () => {
      const userInternal = await seedUserInternal();
      const { org: otherOrg } = await seedOrgContact();
      const units = await seedUnits(org, { count: 2 });
      const otherOrgUnit = await seedUnit(otherOrg);
      await seedRosterEntries(units[0], { count: 4 });
      await seedRosterEntries(units[1], { count: 2 });
      const otherOrgUnitRosterEntries = await seedRosterEntries(otherOrgUnit, { count: 2 });

      // Manually set the timestamps in the roster history to keep things consistent.
      const unit0RosterHistory = await RosterHistory.find({
        where: { unit: units[0].id },
      });

      let ms = 1000;
      for (const historyEntry of unit0RosterHistory) {
        historyEntry.timestamp = moment.utc(ms).toDate();
        await historyEntry.save();
        ms += 1000;
      }

      const timestampSeconds = 2;

      const unit1RosterHistory = await RosterHistory.find({
        where: { unit: units[1].id },
      });

      for (const historyEntry of unit1RosterHistory) {
        historyEntry.timestamp = new Date(ms);
        await historyEntry.save();
        ms += 1;
      }

      const otherOrgUnitRosterHistory = await RosterHistory.find({
        where: { firstName: In(otherOrgUnitRosterEntries.map(x => x.firstName)) },
      });

      for (const historyEntry of otherOrgUnitRosterHistory) {
        historyEntry.timestamp = new Date(ms);
        await historyEntry.save();
        ms += 1;
      }

      req.setUser(userInternal);
      const res = await req.get(`/${org.id}/${units[0].id}/roster?timestamp=${timestampSeconds}`);

      expectNoErrors(res);
      expect(res.data).to.be.array();
      expect(res.data).to.have.lengthOf(2);
    });
  });
});
