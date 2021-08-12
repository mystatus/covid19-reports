import {
  FilterEntityType,
  FilterConfig,
} from '../saved-filter.types';

export type SavedFilterData = {
  name: string;
  entityType: FilterEntityType;
  config?: FilterConfig;
};

export type GetSavedFiltersQuery = {
  entityType?: FilterEntityType;
};

export type AddSavedFilterBody = SavedFilterData;

export type UpdateSavedFilterBody = Partial<SavedFilterData>;
