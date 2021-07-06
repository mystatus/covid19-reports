import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { SavedFilter } from './saved-filter.model';

export function mockSavedFilter(org: Org) {
  return SavedFilter.create({
    org,
    name: uniqueString(),
    filterConfiguration: {},
  });
}

export function seedSavedFilter(org: Org) {
  return mockSavedFilter(org).save();
}

export function seedSavedFilters(org: Org, options: {
  count: number
}) {
  const { count } = options;
  const savedFilters = [] as SavedFilter[];

  for (let i = 0; i < count; i++) {
    savedFilters.push(mockSavedFilter(org));
  }

  return SavedFilter.save(savedFilters);
}
