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
import { setupListeners } from '@reduxjs/toolkit/query';
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
  reportSchemaInitialState,
  reportSchemaReducer,
} from './reducers/report-schema.reducer';
import {
  userInitialState,
  userSlice,
} from './slices/user.slice';
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
import { Modal } from './actions/modal.actions';
import { savedLayoutApi } from './api/saved-layout.api';
import { rosterApi } from './api/roster.api';
import { observationApi } from './api/observation.api';
import {
  musterInitialState,
  musterReducer,
} from './reducers/muster.reducer';
import {
  savedFilterInitialState,
  savedFilterReducer,
} from './reducers/saved-filter.reducer';

const initialState = {
  appFrame: appFrameInitialState,
  notification: notificationInitialState,
  modal: modalInitialState,
  role: roleInitialState,
  unit: unitInitialState,
  muster: musterInitialState,
  filters: savedFilterInitialState,
  reportSchema: reportSchemaInitialState,
  orphanedRecord: orphanedRecordInitialState,
  user: userInitialState,
  localStorage: localStorageInitialState,
};

export type AppState = typeof initialState;

const reducers = combineReducers({
  appFrame: appFrameSlice.reducer,
  notification: notificationReducer,
  modal: modalReducer,
  role: roleReducer,
  unit: unitReducer,
  muster: musterReducer,
  filters: savedFilterReducer,
  reportSchema: reportSchemaReducer,
  orphanedRecord: orphanedRecordSlice.reducer,
  user: userSlice.reducer,
  localStorage: localStorageSlice.reducer,
  [savedLayoutApi.reducerPath]: savedLayoutApi.reducer,
  [rosterApi.reducerPath]: rosterApi.reducer,
  [observationApi.reducerPath]: observationApi.reducer,
});

const persistedReducer = persistReducer({
  key: 'root',
  storage,
  whitelist: ['localStorage'],
}, reducers);

const persistActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'PERSIST_SET'];

const middleware = [
  modalResolverHandler,
  savedLayoutApi.middleware,
  rosterApi.middleware,
  observationApi.middleware,
];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: persistActions.concat([
          Modal.Actions.Alert.type,
        ]),
      },
    }).concat(middleware);
  },
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: initialState,
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
