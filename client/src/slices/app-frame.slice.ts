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
  initialState: appFrameInitialState as AppFrameState,
  reducers: {
    toggleSidenavExpanded: state => {
      return {
        ...state,
        sidenavExpanded: !state.sidenavExpanded,
      };
    },
    setPageLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
      return {
        ...state,
        isPageLoading: action.payload.isLoading,
      };
    },
  },
});

export const AppFrameActions = appFrameSlice.actions;
export default appFrameSlice.reducer;
