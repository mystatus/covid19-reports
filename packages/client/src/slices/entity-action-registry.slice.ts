import { createSlice } from '@reduxjs/toolkit';
import { exportSlice } from '../utility/redux-utils';
import { EntityActionItem } from '../entity-actions/entity-action.types';
import {
  entityActionBakedColumnItems,
  entityActionBakedTableItems,
} from '../entity-actions/entity-action-baked';

// TODO: Use RTK Query for this stff, manually adding baked items to its cache.

export interface EntityActionRegistryState {
  actions: {
    [actionId: string]: EntityActionItem;
  };
}

export const entityActionRegistryInitialState: EntityActionRegistryState = {
  actions: {
    ...entityActionBakedTableItems,
    ...entityActionBakedColumnItems,

    // TEST ACTIONS
    actionRosterAddToRom: {
      type: 'column-button-item',
      id: 'actionRosterAddToRom',
      entityType: 'roster',
      displayName: 'Add to ROM *test*',
      operation: {
        type: 'expression',
        columnName: 'myCustomColumn1',
        expressionKey: 'now',
      },
      requiredPermissions: ['canManageRoster'],
    },
    actionRosterEditMyCustomColumn1: {
      type: 'column-editor-item',
      id: 'actionRosterEditMyCustomColumn1',
      entityType: 'roster',
      displayName: 'Edit My Custom Column 1 *test*',
      operation: {
        type: 'editorValue',
        columnName: 'myCustomColumn1',
      },
      requiredPermissions: ['canManageRoster'],
    },
  },
};

export const entityActionRegistrySlice = createSlice({
  name: 'entityActionRegistry',
  initialState: entityActionRegistryInitialState,
  reducers: {},
});

export const EntityActionRegistryActions = exportSlice(entityActionRegistrySlice);
