import { RosterColumnType } from '@covid19-reports/shared';
import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { CustomRosterColumn } from './custom-roster-column.model';

export function mockCustomRosterColumn(org: Org, options?: {
  customData?: Partial<CustomRosterColumn>
}) {
  const { customData } = options ?? {};

  const name = uniqueString();

  return CustomRosterColumn.create({
    name,
    org,
    display: name,
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
