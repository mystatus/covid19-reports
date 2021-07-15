import { EntityManager } from 'typeorm';
import { Roster } from './roster.model';
import { BadRequestError } from '../../util/error-types';

export async function saveRosterPhoneNumber(edipi: string, phoneNumber: string, entityManager: EntityManager): Promise<void> {
  // The same edipi can potentially be in the roster table multiple times
  // since an individual can be on multiple units.
  const rosters: Roster[] = await Roster.find({ where: { edipi }});
  if (!rosters || rosters.length === 0) {
    throw new BadRequestError(`Unable to find ${edipi} in Roster`);
  }
  rosters.forEach(async roster => {
    roster.phoneNumber = phoneNumber;
    await entityManager.save(roster);
  });
  return Promise.resolve();
}
