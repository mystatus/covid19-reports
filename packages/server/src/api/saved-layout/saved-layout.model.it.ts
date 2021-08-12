// import { expect } from 'chai';
// import { seedOrgContact } from '../../util/test-utils/seed';
// import { SavedLayout } from './saved-layout.model';
// import { seedSavedLayout } from './saved-layout.model.mock';

// describe(`SavedLayout Model`, () => {
//   describe(`cascades on delete`, () => {
//     it(`org`, async () => {
//       const { org } = await seedOrgContact();
//       const savedLayout = await seedSavedLayout(org);

//       const savedLayoutExisting = await SavedLayout.findOne({
//         id: savedLayout.id,
//         org,
//       });
//       expect(savedLayoutExisting).to.exist;

//       await expect(org.remove()).to.be.fulfilled;

//       const savedLayoutDeleted = await SavedLayout.findOne({
//         id: savedLayout.id,
//         org,
//       });
//       expect(savedLayoutDeleted).not.to.exist;
//     });
//   });
// });
