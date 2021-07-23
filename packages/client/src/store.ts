import {
  combineReducers,
  Middleware,
  AnyAction,
} from 'redux';

import { configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  modalInitialState,
  modalReducer,
  modalResolverHandler,
} from './reducers/modal.reducer';
import {
  notificationInitialState,
  notificationReducer,
} from './reducers/notification.reducer';
import {
  roleInitialState,
  roleReducer,
} from './reducers/role.reducer';
import {
  rosterInitialState,
  rosterReducer,
} from './reducers/roster.reducer';
import {
  reportSchemaInitialState,
  reportSchemaReducer,
} from './reducers/report-schema.reducer';
import {
  userInitialState,
  userSlice,
} from './slices/user.slice';
import {
  workspaceInitialState,
  workspaceReducer,
} from './reducers/workspace.reducer';
import {
  unitInitialState,
  unitReducer,
} from './reducers/unit.reducer';

import {
  appFrameInitialState,
  appFrameSlice,
} from './slices/app-frame.slice';

import {
  orphanedRecordSlice,
  orphanedRecordInitialState,
} from './slices/orphaned-record.slice';
import {
  localStorageInitialState,
  localStorageSlice,
} from './slices/local-storage.slice';

const initialState = {
  appFrame: appFrameInitialState,
  notification: notificationInitialState,
  modal: modalInitialState,
  role: roleInitialState,
  unit: unitInitialState,
  reportSchema: reportSchemaInitialState,
  orphanedRecord: orphanedRecordInitialState,
  roster: rosterInitialState,
  user: userInitialState,
  workspace: workspaceInitialState,
  localStorage: localStorageInitialState,
};

export type AppState = typeof initialState;

/**
 * Implementation from node_modules/redux/dist/redux.js:65
 *
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  let proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

function createPlainObjectMiddleware(): Middleware<AnyAction, AppState> {
  return () => {
    return next => {
      return action => {
        if (!isPlainObject(action)) {
          return next({ ...action });
        }
        return next(action);
      };
    };
  };
}

const reducers = combineReducers({
  appFrame: appFrameSlice.reducer,
  notification: notificationReducer,
  modal: modalReducer,
  role: roleReducer,
  unit: unitReducer,
  roster: rosterReducer,
  reportSchema: reportSchemaReducer,
  orphanedRecord: orphanedRecordSlice.reducer,
  user: userSlice.reducer,
  workspace: workspaceReducer,
  localStorage: localStorageSlice.reducer,
});

const persistedReducer = persistReducer({
  key: 'root',
  storage,
  whitelist: ['localStorage'],
}, reducers);

const middleware = [
  modalResolverHandler,
  createPlainObjectMiddleware(),
];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: initialState,
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
