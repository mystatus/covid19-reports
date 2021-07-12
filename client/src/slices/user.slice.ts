import _ from 'lodash';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiUser, ApiUserRole } from '../models/api-response';
import { getLoggedInState } from '../utility/user-utils';
import { AppState } from '../store';
import { UserClient } from '../client/api';

export interface UserState extends ApiUser {
  activeRole?: ApiUserRole
  isLoggedIn: boolean
}

export const userInitialState: UserState = {
  edipi: '',
  firstName: '',
  lastName: '',
  phone: '',
  service: '',
  email: '',
  rootAdmin: false,
  isRegistered: false,
  userRoles: [],
  isLoggedIn: false,
};

export interface UserRegisterData {
  firstName: string
  lastName: string
  phone: string
  service: string
  email: string
}

export interface DashboardPayload {
  orgId: number
  workspaceId: number
  dashboardUuid: string
}

const name = 'user';
const addFavoriteDashboard = createAsyncThunk(`${name}/addFavoriteDashboard`,
  async (arg: DashboardPayload, thunkAPI) => {
    try {
      await UserClient.addFavoriteDashboard(arg.orgId, arg.workspaceId, arg.dashboardUuid);
    } catch (error) {
      return thunkAPI.rejectWithValue(arg);
    }
    return arg;
  });

const removeFavoriteDashboard = createAsyncThunk(`${name}/removeFavoriteDashboard`,
  async (arg: DashboardPayload, thunkAPI) => {
    try {
      await UserClient.removeFavoriteDashboard(arg.orgId, arg.workspaceId, arg.dashboardUuid);
    } catch (error) {
      return thunkAPI.rejectWithValue(arg);
    }
    return arg;
  });

const register = createAsyncThunk(`${name}/register`,
  async (arg: UserRegisterData, thunkAPI) => {
    console.log('register', arg);

    const userData = await UserClient.register({
      firstName: arg.firstName,
      lastName: arg.lastName,
      phone: arg.phone,
      email: arg.email,
      service: arg.service,
    });

    const { localStorage } = thunkAPI.getState() as AppState;

    return {
      userData,
      localStorage,
    };
  });

const refresh = createAsyncThunk(`${name}/refresh`,
  async (arg:void, thunkAPI) => {
    const userData = await UserClient.current();

    console.log('userData', userData);

    const { localStorage } = thunkAPI.getState() as AppState;

    return {
      userData,
      localStorage,
    };
  });

export const userSlice = createSlice({
  name,
  initialState: userInitialState,
  reducers: {
    logout: () => {
      return userInitialState;
    },
    changeOrg: (state, action: PayloadAction<{ orgId: number}>) => {
      const orgId = action.payload.orgId;
      const userRole = state.userRoles?.find(ur => ur.role.org?.id === orgId);
      return {
        ...state,
        activeRole: userRole,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(register.fulfilled, (state, action) => {
      const { userData, localStorage } = action.payload;
      const loggedInState = getLoggedInState(userData, localStorage);
      return {
        ...state,
        ...loggedInState,
      };
    })
      .addCase(refresh.fulfilled, (state, action) => {
        const { userData, localStorage } = action.payload;
        const loggedInState = getLoggedInState(userData, localStorage);
        return {
          ...state,
          ...loggedInState,
        };
      })
      .addCase(addFavoriteDashboard.fulfilled, (state, action) => {
        const { workspaceId, dashboardUuid } = action.payload;
        return addFavoriteDashboardImpl(state, workspaceId, dashboardUuid);
      })
      .addCase(addFavoriteDashboard.rejected, (state, action) => {
        const { workspaceId, dashboardUuid } = action.payload as DashboardPayload;
        return removeFavoriteDashboardImpl(state, workspaceId, dashboardUuid);
      })
      .addCase(removeFavoriteDashboard.fulfilled, (state, action) => {
        const { workspaceId, dashboardUuid } = action.payload;
        return removeFavoriteDashboardImpl(state, workspaceId, dashboardUuid);
      })
      .addCase(removeFavoriteDashboard.rejected, (state, action) => {
        const { workspaceId, dashboardUuid } = action.payload as DashboardPayload;
        return addFavoriteDashboardImpl(state, workspaceId, dashboardUuid);
      })
      .addDefaultCase(state => state);

  },
});

function addFavoriteDashboardImpl(state: UserState, workspaceId: number, dashboardUuid: string) {
  const favoriteDashboards = _.cloneDeep(state.activeRole!.favoriteDashboards);
  if (!favoriteDashboards[workspaceId]) {
    favoriteDashboards[workspaceId] = {};
  }
  favoriteDashboards[workspaceId][dashboardUuid] = true;
  return {
    ...state,
    activeRole: {
      ...state.activeRole!,
      favoriteDashboards,
    },
  };
}

function removeFavoriteDashboardImpl(state: UserState, workspaceId: number, dashboardUuid: string) {
  const favoriteDashboards = _.cloneDeep(state.activeRole!.favoriteDashboards);
  if (favoriteDashboards[workspaceId]) {
    delete favoriteDashboards[workspaceId][dashboardUuid];
  }
  return {
    ...state,
    activeRole: {
      ...state.activeRole!,
      favoriteDashboards,
    },
  };
}

export const UserActions = {
  ...userSlice.actions,
  register,
  refresh,
  addFavoriteDashboard,
  removeFavoriteDashboard,
};
