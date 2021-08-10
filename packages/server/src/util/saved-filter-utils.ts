import { FindOneOptions } from 'typeorm';
import { SavedFilter } from '../api/saved-filter/saved-filter.model';
import { SavedFilterNotFoundError } from './error-types';

export async function requireSavedFilter(savedFilterId: number, findOptions?: FindOneOptions<SavedFilter>) {
  const savedFilter = await SavedFilter.findOne(savedFilterId, findOptions);

  if (!savedFilter) {
    throw new SavedFilterNotFoundError(savedFilterId);
  }

  return savedFilter;
}
