import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
  Middleware,
  AnyAction,
} from 'redux';
import thunk from 'redux-thunk';
import {
  persistStore,
  persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  appFrameInitialState,
  appFrameReducer,
} from './reducers/app-frame.reducer';
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
  localStorageInitialState,
  localStorageReducer,
} from './reducers/local-storage.reducer';
import {
  userInitialState,
  userReducer,
} from './reducers/user.reducer';
import {
  workspaceInitialState,
  workspaceReducer,
} from './reducers/workspace.reducer';
import {
  unitInitialState,
  unitReducer,
} from './reducers/unit.reducer';
import {
  modalInitialState,
  modalReducer,
} from './reducers/modal.reducer';

export const initialState = {
  appFrame: appFrameInitialState,
  notification: notificationInitialState,
  modal: modalInitialState,
  role: roleInitialState,
  unit: unitInitialState,
  roster: rosterInitialState,
  user: userInitialState,
  workspace: workspaceInitialState,
  localStorage: localStorageInitialState,
};

export type AppState = typeof initialState;

// React Devtools Extension
const composeEnhancers = typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  })
  : compose;


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

export const configureStore = () => {
  const store = createStore(
    persistReducer(
      persistConfig,
      combineReducers({
        appFrame: appFrameReducer,
        notification: notificationReducer,
        modal: modalReducer,
        role: roleReducer,
        unit: unitReducer,
        roster: rosterReducer,
        user: userReducer,
        workspace: workspaceReducer,
        localStorage: localStorageReducer,
      }),
    ),
    initialState,
    composeEnhancers(
      applyMiddleware(
        thunk,
        createPlainObjectMiddleware(),
      ),
    ),
  );

  return {
    store,
    persistor: persistStore(store),
  };
};
