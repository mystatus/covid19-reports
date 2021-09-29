import { expect } from 'chai';
import FormData from 'form-data';
import _ from 'lodash';
import {
  baseRosterColumns,
  ColumnType,
  GetEntitiesQuery,
} from '@covid19-reports/shared';
import { expectNoErrors } from '../../util/test-utils/expect';
import {
  seedOrgContact,
  seedOrgContactRoles,
} from '../../util/test-utils/seed';
import { TestRequest } from '../../util/test-utils/test-request';
import {
  uniqueEdipi,
  uniqueString,
} from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { seedRoleAdmin } from '../role/role.model.mock';
import { seedUnit } from '../unit/unit.model.mock';
import { seedUserRole } from '../user/user-role.model.mock';
import { User } from '../user/user.model';
import {
  seedUser,
  seedUserInternal,
} from '../user/user.model.mock';
import { CustomRosterColumn } from './custom-roster-column.model';
import { seedCustomRosterColumn } from './custom-roster-column.model.mock';
import {
  ChangeType,
  RosterHistory,
} from './roster-history.model';
import { Roster } from './roster.model';
import {
  mockRosterUploadCsv,
  seedRosterEntries,
  seedRosterEntry,
} from './roster.model.mock';

describe(`Roster Controller`, () => {
  const basePath = '/api/roster';
  let req: TestRequest;
  let org: Org;
  let contact: User;

  beforeEach(async () => {
    ({ org, contact } = await seedOrgContactRoles());
    req = new TestRequest(basePath);
    req.setUser(contact);
  });

  describe(`${basePath}/:orgId/column : get`, () => {
    it(`gets the org's roster column info`, async () => {
      const columnA = await seedCustomRosterColumn(org);
      const columnB = await seedCustomRosterColumn(org);

      const res = await req.get(`/${org.id}/column`);

      expectNoErrors(res);
      expect(res.data).to.be.array();
      expect(res.data).to.have.lengthOf(baseRosterColumns.length + 2);
      const dataColumnNames = res.data.map((x: CustomRosterColumn) => x.name);
      expect(dataColumnNames).to.include.members([columnA.name, columnB.name]);
    });
  });

  describe(`${basePath}/:orgId/column : post`, () => {
    it(`adds a custom roster column to the org`, async () => {
      const customColumnsCountBefore = await CustomRosterColumn.count({
        where: { org },
      });

      const body = {
        displayName: 'Some Column Name',
        type: ColumnType.String,
        pii: true,
        phi: true,
        required: true,
        config: {
          stuff: uniqueString(),
        },
      };
      const res = await req.post(`/${org.id}/column`, body);

      expectNoErrors(res);
      expect(res.data.name).to.exist;
      const columnName = res.data.name;

      const columnAfter = (await CustomRosterColumn.findOne({
        name: columnName,
        org,
      }, {
        relations: ['org'],
      }))!;
      expect(columnAfter).to.exist;
      expect(columnAfter.org!.id).to.equal(org.id);
      expect(columnAfter).to.containSubset({
        name: _.camelCase(body.displayName),
        display: body.displayName,
        type: body.type,
        pii: body.pii,
        phi: body.phi,
        required: body.required,
        config: body.config,
      });

      const customColumnsCountAfter = await CustomRosterColumn.count({
        where: { org },
      });
      expect(customColumnsCountAfter).to.equal(customColumnsCountBefore + 1);
    });
  });

  describe(`${basePath}/:orgId/column/:columnName : put`, () => {
    it(`updates the custom column`, async () => {
      const column = await seedCustomRosterColumn(org);

      const body = {
        pii: !column.pii,
        phi: !column.phi,
        required: !column.required,
        config: {
          stuff: uniqueString(),
        },
      };
      const res = await req.put(`/${org.id}/column/${column.name}`, body);

      expectNoErrors(res);
      expect(res.data.name).to.equal(column.name);

      const columnAfter = (await CustomRosterColumn.findOne({
        name: column.name,
        org,
      }))!;
      expect(columnAfter).to.containSubset({
        pii: body.pii,
        phi: body.phi,
        required: body.required,
        config: body.config,
      });
    });
  });

  describe(`${basePath}/:orgId/column/:columnName : delete`, () => {
    it(`deletes the column`, async () => {
      const column = await seedCustomRosterColumn(org);

      const columnBefore = await CustomRosterColumn.findOne({
        name: column.name,
        org,
      });
      expect(columnBefore).to.exist;

      const columnCountBefore = await CustomRosterColumn.count();

      const res = await req.delete(`/${org.id}/column/${column.name}`);

      expectNoErrors(res);

      const columnAfter = await CustomRosterColumn.findOne({
        name: column.name,
        org,
      });
      expect(columnAfter).not.to.exist;

      expect(await CustomRosterColumn.count()).to.equal(columnCountBefore - 1);
    });
  });

  describe(`${basePath}/:orgId/template : get`, () => {
    it(`gets the org's roster template`, async () => {
      const customColumn = await seedCustomRosterColumn(org);

      const res = await req.get(`/${org.id}/template`);

      expectNoErrors(res);
      expect(res.data).to.be.a('string');
      const csvHeaderParts = res.data.split('\n')[0].split(',');
      expect(csvHeaderParts).to.include.members(['Unit', 'DoD ID', 'First Name', 'Last Name', customColumn.display]);
      expect(csvHeaderParts).to.include(customColumn.name);
    });
  });

  describe(`${basePath}/:orgId/allowed-column : get`, () => {
    it(`gets the org's roster column info`, async () => {
      const customColumn = await seedCustomRosterColumn(org);

      const res = await req.get(`/${org.id}/allowed-column`);

      expectNoErrors(res);
      expect(res.data).to.be.array();
      const dataNames = res.data.map((x: CustomRosterColumn) => x.name);
      expect(dataNames).to.include.members(baseRosterColumns.map(x => x.name));
      expect(dataNames).to.include(customColumn.name);
    });
  });

  describe(`${basePath}/:orgId : get`, () => {
    it(`gets the org's roster`, async () => {
      const units = [
        await seedUnit(org),
        await seedUnit(org),
      ];
      const rosterEntries = [
        await seedRosterEntry(units[0]),
        await seedRosterEntry(units[0]),
        await seedRosterEntry(units[1]),
      ];

      const res = await req.get(`/${org.id}`);

      expectNoErrors(res);
      expect(res.data.rows).to.be.array();
      expect(res.data.rows).to.have.lengthOf(rosterEntries.length);
      expect(res.data.totalRowsCount).to.equal(rosterEntries.length);
      const dataIds = res.data.rows.map((x: Roster) => x.id);
      expect(dataIds).to.include.members(rosterEntries.map(x => x.id));
    });

    it(`returns the matching roster entries`, async () => {
      const units = [
        await seedUnit(org),
        await seedUnit(org),
      ];
      const rosterEntries = [
        await seedRosterEntry(units[0]),
        await seedRosterEntry(units[0]),
        await seedRosterEntry(units[1]),
      ];

      const query: GetEntitiesQuery = {
        page: '0',
        limit: '10',
        filterConfig: {
          firstName: {
            op: '=',
            value: rosterEntries[1].firstName,
            expression: '',
            expressionEnabled: false,
          },
        },
      };

      const res = await req.get(`/${org.id}`, {
        params: query,
      });

      expectNoErrors(res);
      expect(res.data.rows).to.be.array();
      expect(res.data.rows).to.have.lengthOf(1);
      expect(res.data.totalRowsCount).to.equal(1);
      expect(res.data.rows[0].edipi).to.equal(rosterEntries[1].edipi);
    });
  });

  describe(`${basePath}/:orgId : post`, () => {
    it(`adds a roster entry to the org`, async () => {
      const unit = await seedUnit(org);

      const rosterCountBefore = await Roster.count({
        where: {
          unit: unit.id,
        },
      });

      const rosterHistoryCountBefore = await RosterHistory.count({
        where: {
          unit: unit.id,
        },
      });

      const body = {
        edipi: uniqueEdipi(),
        firstName: uniqueString(),
        lastName: uniqueString(),
        unit: unit.id,
      };
      const res = await req.post(`/${org.id}`, body);

      expectNoErrors(res);
      expect(res.data.id).to.exist;

      const rosterEntryAfter = await Roster.findOne({
        where: {
          edipi: body.edipi,
          unit: unit.id,
        },
      });
      expect(rosterEntryAfter).to.exist;

      const rosterCountAfter = await Roster.count({
        where: {
          unit: unit.id,
        },
      });
      expect(rosterCountAfter).to.equal(rosterCountBefore + 1);

      const rosterHistoryAfter = (await RosterHistory.findOne({
        where: {
          unit: unit.id,
        },
        order: {
          timestamp: 'DESC',
        },
      }))!;
      expect(rosterHistoryAfter.edipi).to.equal(body.edipi);
      expect(rosterHistoryAfter.changeType).to.equal(ChangeType.Added);

      const rosterHistoryCountAfter = await RosterHistory.count({
        where: {
          unit: unit.id,
        },
      });
      expect(rosterHistoryCountAfter).to.equal(rosterHistoryCountBefore + 1);
    });
  });

  describe(`${basePath}/:orgId/bulk : post`, () => {
    it(`adds multiple roster entries with an uploaded csv`, async () => {
      const unit = await seedUnit(org);

      const rosterCountBefore = await Roster.count({
        where: {
          unit: unit.id,
        },
      });

      const rosterHistoryCountBefore = await RosterHistory.count({
        where: {
          unit: unit.id,
        },
      });

      const entriesToAdd = 3;
      const rosterCsv = await mockRosterUploadCsv({
        unit,
        rosterCount: entriesToAdd,
      });
      const formData = new FormData();
      formData.append('roster_csv', rosterCsv, 'roster.csv');

      const res = await req.post(`/${org.id}/bulk`, formData, {
        headers: formData.getHeaders(),
      });

      expectNoErrors(res);

      const rosterCountAfter = await Roster.count({
        where: {
          unit: unit.id,
        },
      });
      expect(rosterCountAfter).to.equal(rosterCountBefore + entriesToAdd);

      const rosterHistoryCountAfter = await RosterHistory.count({
        where: {
          unit: unit.id,
        },
      });
      expect(rosterHistoryCountAfter).to.equal(rosterHistoryCountBefore + entriesToAdd);
    });
  });

  describe(`${basePath}/:orgId/bulk : delete`, () => {
    it(`deletes all roster entries visible to the user in the org`, async () => {
      // Unit that should have its roster deleted.
      const unitToBeCleared = await seedUnit(org);
      const rosterEntriesToBeDeleted = await seedRosterEntries(unitToBeCleared, { count: 3 });

      // User who can only see the one unit.
      const user = await seedUser();
      const role = await seedRoleAdmin(org);
      await seedUserRole(user, role, {
        customData: {
          units: [unitToBeCleared],
          allUnits: false,
        },
      });

      // Unit in same org, that should be untouched.
      const otherUnit = await seedUnit(org);
      await seedRosterEntries(otherUnit, { count: 2 });

      // Unit in other org, that should be untouched.
      const { org: otherOrg } = await seedOrgContact();
      const otherOrgUnit = await seedUnit(otherOrg);
      await seedRosterEntries(otherOrgUnit, { count: 2 });

      const rosterCountBefore = await Roster.count();

      const clearedRosterCountBefore = await Roster.count({
        where: { unit: unitToBeCleared.id },
      });

      const otherUnitRosterCountBefore = await Roster.count({
        where: { unit: otherUnit.id },
      });

      const otherOrgUnitRosterCountBefore = await Roster.count({
        where: { unit: otherOrgUnit.id },
      });

      req.setUser(user);
      const res = await req.delete(`/${org.id}/bulk`);

      expectNoErrors(res);

      const rosterCountAfter = await Roster.count();
      expect(rosterCountAfter).to.equal(rosterCountBefore - rosterEntriesToBeDeleted.length);

      const clearedRosterCountAfter = await Roster.count({
        where: { unit: unitToBeCleared.id },
      });
      expect(clearedRosterCountAfter).to.equal(clearedRosterCountBefore - rosterEntriesToBeDeleted.length);

      const otherUnitRosterCountAfter = await Roster.count({
        where: { unit: otherUnit.id },
      });
      expect(otherUnitRosterCountAfter).to.equal(otherUnitRosterCountBefore);

      const otherOrgUnitRosterCountAfter = await Roster.count({
        where: { unit: otherOrgUnit.id },
      });
      expect(otherOrgUnitRosterCountAfter).to.equal(otherOrgUnitRosterCountBefore);
    });
  });

  describe(`${basePath}/:orgId/:rosterId : get`, () => {
    it(`gets a roster entry in the org`, async () => {
      const unit = await seedUnit(org);
      const rosterEntries = [
        await seedRosterEntry(unit),
        await seedRosterEntry(unit),
      ];

      const res = await req.get(`/${org.id}/${rosterEntries[0].id}`);

      expectNoErrors(res);
      expect(res.data).to.containSubset({
        id: rosterEntries[0].id,
        edipi: rosterEntries[0].edipi,
        firstName: rosterEntries[0].firstName,
        lastName: rosterEntries[0].lastName,
      });
    });
  });

  describe(`${basePath}/:orgId/:rosterId : delete`, () => {
    it(`deletes a roster entry in the org`, async () => {
      const unit = await seedUnit(org);
      const rosterEntries = [
        await seedRosterEntry(unit),
        await seedRosterEntry(unit),
      ];

      const rosterEntriesCountBefore = await Roster.count();

      const rosterEntry0Before = await Roster.findOne(rosterEntries[0].id);
      expect(rosterEntry0Before).to.exist;

      const rosterEntry1Before = await Roster.findOne(rosterEntries[1].id);
      expect(rosterEntry1Before).to.exist;

      const res = await req.delete(`/${org.id}/${rosterEntries[0].id}`);

      expectNoErrors(res);

      expect(await Roster.count()).to.equal(rosterEntriesCountBefore - 1);

      const rosterEntry0After = await Roster.findOne(rosterEntries[0].id);
      expect(rosterEntry0After).not.to.exist;

      const rosterEntry1After = await Roster.findOne(rosterEntries[1].id);
      expect(rosterEntry1After).to.exist;
    });
  });

  describe(`${basePath}/:orgId/:rosterId : put`, () => {
    it(`updates a roster entry in the org`, async () => {
      const unit = await seedUnit(org);
      const rosterEntries = [
        await seedRosterEntry(unit),
        await seedRosterEntry(unit),
      ];

      const body = {
        firstName: uniqueString(),
        lastName: uniqueString(),
      };
      const res = await req.put(`/${org.id}/${rosterEntries[0].id}`, body);

      expectNoErrors(res);

      const rosterEntry0After = (await Roster.findOne(rosterEntries[0].id))!;
      expect(rosterEntry0After.firstName).to.equal(body.firstName);
      expect(rosterEntry0After.lastName).to.equal(body.lastName);
    });
  });
});
