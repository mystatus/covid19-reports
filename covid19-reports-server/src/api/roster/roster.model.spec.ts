import { expect } from 'chai';
import { seedOrgContact } from '../../util/test-utils/seed';
import { seedUnit } from '../unit/unit.model.mock';
import { Roster } from './roster.model';
import { seedRosterEntry } from './roster.model.mock';

describe(`Roster Model`, () => {

  describe(`restricts on delete`, () => {

    it(`unit`, async () => {
      const { org } = await seedOrgContact();
      const unit = await seedUnit(org);
      const rosterEntry = await seedRosterEntry(unit);

      const rosterEntryBefore = await Roster.findOne(rosterEntry.id);
      expect(rosterEntryBefore).to.exist;

      await expect(unit.remove()).to.be.rejected;

      const rosterEntryAfter = await Roster.findOne(rosterEntry.id);
      expect(rosterEntryAfter).to.exist;
    });

  });

});
