import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  ApiUser,
  ApiUserRole,
} from '../models/api-response';
import { getLoggedInState } from '../utility/user-utils';
import { AppState } from '../store';
import { UserClient } from '../client/user.client';
import {
  assign,
  exportSlice,
} from '../utility/redux-utils';

export interface UserState extends ApiUser {
  activeRole?: ApiUserRole;
  isLoggedIn: boolean;
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
  firstName: string;
  lastName: string;
  phone: string;
  service: string;
  email: string;
}

const name = 'user';

const thunks = {
  register: createAsyncThunk(
    `${name}/register`,
    async (arg: UserRegisterData, thunkAPI) => {
      console.log('register', arg);

      const userData = await UserClient.registerUser({
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
    },
  ),

  refresh: createAsyncThunk(
    `${name}/refresh`,
    async (arg: void, thunkAPI) => {
      const userData = await UserClient.current();

      console.log('userData', userData);

      const { localStorage } = thunkAPI.getState() as AppState;

      return {
        userData,
        localStorage,
      };
    },
  ),
};

export const userSlice = createSlice({
  name,
  initialState: userInitialState,
  reducers: {
    logout: () => userInitialState,
    changeOrg: (state, { payload }: PayloadAction<{ orgId: number }>) => {
      const { orgId } = payload;
      const userRole = state.userRoles?.find(ur => ur.role.org?.id === orgId);
      state.activeRole = userRole;
    },
  },
  extraReducers: builder => builder
    .addCase(thunks.register.fulfilled, (state, { payload }) => {
      const { userData, localStorage } = payload;
      const loggedInState = getLoggedInState(userData, localStorage);
      assign(state, loggedInState);
    })
    .addCase(thunks.refresh.fulfilled, (state, { payload }) => {
      const { userData, localStorage } = payload;
      const loggedInState = getLoggedInState(userData, localStorage);
      assign(state, loggedInState);
    })
});

export const UserActions = exportSlice(userSlice, thunks);
