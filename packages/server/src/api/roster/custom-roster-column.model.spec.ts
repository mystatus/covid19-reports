import { expect } from 'chai';
import { seedOrgContact } from '../../util/test-utils/seed';
import { CustomRosterColumn } from './custom-roster-column.model';
import { seedCustomRosterColumn } from './custom-roster-column.model.mock';

describe(`CustomRosterColumn Model`, () => {
  describe(`cascades on delete`, () => {
    it(`org`, async () => {
      const { org } = await seedOrgContact();
      const column = await seedCustomRosterColumn(org);

      const columnBefore = await CustomRosterColumn.findOne({
        name: column.name,
        org,
      });
      expect(columnBefore).to.exist;

      await expect(org.remove()).to.be.fulfilled;

      const columnAfter = await CustomRosterColumn.findOne({
        name: column.name,
        org,
      });
      expect(columnAfter).not.to.exist;
    });
  });
});
