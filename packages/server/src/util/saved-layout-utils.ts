import { FindOneOptions } from 'typeorm';
import { SavedLayout } from '../api/saved-layout/saved-layout.model';
import { SavedLayoutNotFoundError } from './error-types';

export async function requireSavedLayout(savedLayoutId: number, findOptions?: FindOneOptions<SavedLayout>) {
  const savedLayout = await SavedLayout.findOne(savedLayoutId, findOptions);

  if (!savedLayout) {
    throw new SavedLayoutNotFoundError(savedLayoutId);
  }

  return savedLayout;
}
