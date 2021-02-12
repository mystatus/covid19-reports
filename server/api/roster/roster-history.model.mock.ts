import {
  uniqueDate,
  uniqueString,
} from '../../util/test-utils/unique';
import { Unit } from '../unit/unit.model';
import {
  ChangeType,
  RosterHistory,
} from './roster-history.model';

export async function seedRosterHistory(unit: Unit) {
  const rosterHistory = RosterHistory.create({
    unit,
    edipi: uniqueString(),
    firstName: uniqueString(),
    lastName: uniqueString(),
    customColumns: {
      stuff: uniqueString(),
    },
    timestamp: uniqueDate(),
    changeType: ChangeType.Changed,
  });
  return rosterHistory.save();
}
