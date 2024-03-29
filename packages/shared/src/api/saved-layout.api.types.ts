import { EntityType } from '../entity.types';
import { ActionsConfig, ColumnsConfig } from '../saved-layout.types';

export type SavedLayoutData = {
  name: string;
  entityType: EntityType;
  actions: ActionsConfig;
  columns: ColumnsConfig;
};

export type GetSavedLayoutsQuery = {
  entityType?: EntityType;
};

export type AddSavedLayoutBody = SavedLayoutData;

export type UpdateSavedLayoutBody = Partial<SavedLayoutData>;
