import { Roster } from './roster.model';
import { BadRequestError } from '../../util/error-types';

export async function saveRosterPhoneNumber(edipi: string, phoneNumber: string) {
  const roster = await Roster.findOne({ where: { edipi }});
  if (roster) {
    roster.phoneNumber = phoneNumber;
    return roster.save();
  }
  throw new BadRequestError(`Unable to find ${edipi} in Roster`);
}
