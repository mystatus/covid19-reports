import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist/es/constants';
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

const persistActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'PERSIST_SET'];

const middleware = [
  modalResolverHandler,
];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: persistActions,
      },
    }).concat(middleware);
  },
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: initialState,
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
