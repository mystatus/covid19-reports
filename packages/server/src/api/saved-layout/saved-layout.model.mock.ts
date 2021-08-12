import { EntityType } from '@covid19-reports/shared';
import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { SavedLayout } from './saved-layout.model';

export function mockSavedLayout(org: Org, customData?: Partial<SavedLayout>) {
  return SavedLayout.create({
    org,
    name: uniqueString(),
    entityType: EntityType.RosterEntry,
    config: {},
    ...customData,
  });
}

export function seedSavedLayout(org: Org, customData?: Partial<SavedLayout>) {
  return mockSavedLayout(org, customData).save();
}

export function seedSavedLayouts(org: Org, options: {
  count: number;
  customData?: Partial<SavedLayout>;
}) {
  const { count, customData } = options;
  const savedLayouts = [] as SavedLayout[];

  for (let i = 0; i < count; i++) {
    savedLayouts.push(mockSavedLayout(org, customData));
  }

  return SavedLayout.save(savedLayouts);
}
