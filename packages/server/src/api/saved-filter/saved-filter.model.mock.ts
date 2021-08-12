import { EntityType } from '@covid19-reports/shared';
import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { SavedFilter } from './saved-filter.model';

export function mockSavedFilter(org: Org, customData?: Partial<SavedFilter>) {
  return SavedFilter.create({
    org,
    name: uniqueString(),
    entityType: EntityType.RosterEntry,
    config: {},
    ...customData,
  });
}

export function seedSavedFilter(org: Org, customData?: Partial<SavedFilter>) {
  return mockSavedFilter(org, customData).save();
}

export function seedSavedFilters(org: Org, options: {
  count: number;
  customData?: Partial<SavedFilter>;
}) {
  const { count, customData } = options;
  const savedFilters = [] as SavedFilter[];

  for (let i = 0; i < count; i++) {
    savedFilters.push(mockSavedFilter(org, customData));
  }

  return SavedFilter.save(savedFilters);
}
