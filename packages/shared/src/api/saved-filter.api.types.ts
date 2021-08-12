import { EntityType } from '../entity.types';
import { FilterConfig } from '../saved-filter.types';

export type SavedFilterData = {
  name: string;
  entityType: EntityType;
  config?: FilterConfig;
};

export type GetSavedFiltersQuery = {
  entityType?: EntityType;
};

export type AddSavedFilterBody = SavedFilterData;

export type UpdateSavedFilterBody = Partial<SavedFilterData>;
