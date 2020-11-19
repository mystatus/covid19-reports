import {
  createStore, combineReducers, applyMiddleware, compose, Middleware, AnyAction,
} from 'redux';
import thunk from 'redux-thunk';
import { appFrameInitialState, appFrameReducer, AppFrameState } from './reducers/app-frame.reducer';
import { NotificationState, notificationInitialState, notificationReducer } from './reducers/notification.reducer';
import { RoleState, roleInitialState, roleReducer } from './reducers/role.reducer';
import { RosterState, rosterInitialState, rosterReducer } from './reducers/roster.reducer';
import { UserState, userInitialState, userReducer } from './reducers/user.reducer';
import { WorkspaceState, workspaceInitialState, workspaceReducer } from './reducers/workspace.reducer';

export interface AppState {
  appFrame: AppFrameState
  notification: NotificationState
  role: RoleState
  roster: RosterState
  user: UserState
  workspace: WorkspaceState
}

export const initialState: AppState = {
  appFrame: appFrameInitialState,
  notification: notificationInitialState,
  role: roleInitialState,
  roster: rosterInitialState,
  user: userInitialState,
  workspace: workspaceInitialState,
};

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
  if (typeof obj !== 'object' || obj === null) { return false; }
  let proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

function createPlainObjectMiddleware(): Middleware<AnyAction, AppState> {
  return function() {
    return function(next) {
      return function(action) {
        if (!isPlainObject(action)) {
          return next({ ...action });
        }
        return next(action);
      };
    };
  };
}

export default createStore(
  combineReducers({
    appFrame: appFrameReducer,
    notification: notificationReducer,
    role: roleReducer,
    roster: rosterReducer,
    user: userReducer,
    workspace: workspaceReducer,
  }),
  initialState,
  composeEnhancers(
    applyMiddleware(
      thunk,
      createPlainObjectMiddleware(),
    ),
  ),
);
