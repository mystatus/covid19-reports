import { expect } from 'chai';
import { seedOrgContact } from '../../util/test-utils/seed';
import { Unit } from './unit.model';
import { seedUnit } from './unit.model.mock';

describe(`Unit Model`, () => {

  describe(`cascades on delete`, () => {

    it(`org`, async () => {
      const { org } = await seedOrgContact();
      const unit = await seedUnit(org);

      const unitExisting = await Unit.findOne({
        id: unit.id,
        org,
      });
      expect(unitExisting).to.exist;

      await expect(org.remove()).to.be.fulfilled;

      const unitDeleted = await Unit.findOne({
        id: unit.id,
        org,
      });
      expect(unitDeleted).not.to.exist;
    });

  });

});

// HACK: Workaround for tsconfig "isolatedModules"
export const dummy = 0;
