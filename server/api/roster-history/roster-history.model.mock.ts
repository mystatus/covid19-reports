import {
  uniqueDate,
  uniqueString,
} from '../../util/test-utils/unique';
import { RosterHistoryChangeType } from '../roster/roster.types';
import { Unit } from '../unit/unit.model';
import {
  RosterHistory,
} from './roster-history.model';

export function mockRosterHistory(unit: Unit) {
  return RosterHistory.create({
    unit,
    edipi: uniqueString(),
    firstName: uniqueString(),
    lastName: uniqueString(),
    customColumns: {
      stuff: uniqueString(),
    },
    timestamp: uniqueDate(),
    changeType: RosterHistoryChangeType.Changed,
  });
}

export function seedRosterHistory(unit: Unit) {
  return mockRosterHistory(unit).save();
}
