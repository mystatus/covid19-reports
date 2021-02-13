import { expect } from 'chai';
import { seedOrgContact } from '../../util/test-utils/seed';
import { Org } from './org.model';

describe(`Org Model`, () => {

  describe(`restricts on delete`, () => {

    it(`contact`, async () => {
      const { org, contact } = await seedOrgContact();

      let orgExisting = await Org.findOne(org.id);
      expect(orgExisting).to.exist;

      await expect(contact.remove()).to.be.rejected;

      orgExisting = await Org.findOne(org.id);
      expect(orgExisting).to.exist;
    });

  });

});
