import { createEntityApi } from './api-utils';

export const observationApi = createEntityApi({
  entityType: 'observation',
  hasVersionedColumns: true,
});
