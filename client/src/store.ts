import {
  combineReducers,
  Middleware,
  AnyAction,
} from 'redux';

import { configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
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
  localStorageInitialState,
  localStorageReducer,
} from './reducers/local-storage.reducer';
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
  orphanedSlice,
  orphanedRecordInitialState,
} from './slices/orphaned-record.slice';

export const initialState = {
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

// React Devtools Extension
/* const composeEnhancers = typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  })
  : compose; */


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

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['localStorage'],
};

const reducers = combineReducers({
  appFrame: appFrameSlice.reducer,
  notification: notificationReducer,
  modal: modalReducer,
  role: roleReducer,
  unit: unitReducer,
  roster: rosterReducer,
  reportSchema: reportSchemaReducer,
  orphanedRecord: orphanedSlice.reducer,
  user: userSlice.reducer,
  workspace: workspaceReducer,
  localStorage: localStorageReducer,
});
const persistedReducer = persistReducer(persistConfig, reducers);

const middleware = [modalResolverHandler, createPlainObjectMiddleware()];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().concat(middleware);
  },
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: initialState,
});


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
