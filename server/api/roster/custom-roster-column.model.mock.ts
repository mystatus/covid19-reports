import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { CustomRosterColumn } from './custom-roster-column.model';
import { RosterColumnType } from './roster.types';

export function mockCustomRosterColumn(org: Org, options?: {
  customData?: Partial<CustomRosterColumn>
}) {
  const { customData } = options ?? {};

  return CustomRosterColumn.create({
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
}

export function seedCustomRosterColumn(org: Org, options?: {
  customData?: Partial<CustomRosterColumn>
}) {
  return mockCustomRosterColumn(org, options).save();
}
