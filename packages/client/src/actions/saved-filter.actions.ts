import { Dispatch } from 'redux';
import { EntityType, SavedFilterSerialized } from '@covid19-reports/shared';
import { SavedFilterClient } from '../client/saved-filter.client';

export namespace SavedFilter {

  export namespace Actions {

    export class Fetch {

      static type = 'FETCH_SAVED_FILTERS';
      type = Fetch.type;

    }
    export class FetchSuccess {

      static type = `${Fetch.type}_SUCCESS`;
      type = FetchSuccess.type;
      constructor(public payload: {
        entityType: EntityType;
        filters: SavedFilterSerialized[];
      }) {}

    }
    export class FetchFailure {

      static type = `${Fetch.type}_FAILURE`;
      type = FetchFailure.type;
      constructor(public payload: {
        error: any;
      }) { }

    }
  }

  export const fetch = (orgId: number, entityType: EntityType) => async (dispatch: Dispatch) => {
    dispatch({ ...new Actions.Fetch() });
    try {
      const filters = await SavedFilterClient.getSavedFilters(orgId, { entityType });
      dispatch({ ...new Actions.FetchSuccess({ entityType, filters }) });
    } catch (error) {
      dispatch({ ...new Actions.FetchFailure({ error }) });
    }
  };
}

