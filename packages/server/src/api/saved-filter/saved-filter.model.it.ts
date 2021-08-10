import { expect } from 'chai';
import { seedOrgContact } from '../../util/test-utils/seed';
import { SavedFilter } from './saved-filter.model';
import { seedSavedFilter } from './saved-filter.model.mock';

describe(`SavedFilter Model`, () => {
  describe(`cascades on delete`, () => {
    it(`org`, async () => {
      const { org } = await seedOrgContact();
      const savedFilter = await seedSavedFilter(org);

      const savedFilterExisting = await SavedFilter.findOne({
        id: savedFilter.id,
        org,
      });
      expect(savedFilterExisting).to.exist;

      await expect(org.remove()).to.be.fulfilled;

      const savedFilterDeleted = await SavedFilter.findOne({
        id: savedFilter.id,
        org,
      });
      expect(savedFilterDeleted).not.to.exist;
    });
  });
});
