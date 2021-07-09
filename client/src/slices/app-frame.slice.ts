import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

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
    setPageLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
      state.isPageLoading = action.payload.isLoading;
    },
  },
});

export const AppFrameActions = appFrameSlice.actions;
