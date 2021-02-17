import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { CustomRosterColumn } from './custom-roster-column.model';
import { RosterColumnType } from './roster.types';

export async function seedCustomRosterColumn(org: Org, customData?: Partial<CustomRosterColumn>) {
  const customRosterColumn = CustomRosterColumn.create({
    name: uniqueString(),
    org,
    display: uniqueString(),
    type: RosterColumnType.String,
    pii: true,
    phi: true,
    required: true,
    config: {
      stuff: uniqueString(),
    },
    ...customData,
  });
  return customRosterColumn.save();
}
