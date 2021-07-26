import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { exportSlice } from '../utility/redux-utils';

export interface AppFrameState {
  sidenavExpanded: boolean
  isPageLoading: boolean
}

export const appFrameInitialState: AppFrameState = {
  sidenavExpanded: true,
  isPageLoading: false,
};

export const appFrameSlice = createSlice({
  name: 'appFrame',
  initialState: appFrameInitialState,
  reducers: {
    toggleSidenavExpanded: state => {
      state.sidenavExpanded = !state.sidenavExpanded;
    },
    setPageLoading: (state, { payload }: PayloadAction<{ isLoading: boolean }>) => {
      state.isPageLoading = payload.isLoading;
    },
  },
});

export const AppFrameActions = exportSlice(appFrameSlice);
