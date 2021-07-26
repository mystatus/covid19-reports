import { createSlice } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/types/types-external';
import { HelpCard } from '../actions/help-card.actions';
import { Persist } from '../actions/persist.actions';
import { UserActions } from './user.slice';
import { Dict } from '../utility/typescript-utils';
import { getLoggedInState } from '../utility/user-utils';
import { ApiUser } from '../models/api-response';

// We need to be careful about what goes into local storage due to security concerns. So make sure not to add anything
// that is clearly identifying of groups, units, or individuals, such as PII/PHI data, group name, etc.
export interface LocalStorageState extends Record<string, any> {
  orgId?: number
  hideHelpCard: Dict<boolean>
}

export const localStorageInitialState: LocalStorageState = {
  hideHelpCard: {},
};

export const localStorageSlice = createSlice({
  name: 'localStorage',
  initialState: localStorageInitialState,
  reducers: {},
  extraReducers: builder => builder
    .addCase(UserActions.refresh.fulfilled, (state, { payload }) => {
      userRefreshed(state, payload);
    })
    .addCase(UserActions.register.fulfilled, (state, { payload }) => {
      userRefreshed(state, payload);
    })
    .addCase(UserActions.logout, () => localStorageInitialState)
    .addCase(UserActions.changeOrg, (state, { payload }) => {
      state.orgId = payload.orgId;
    })
    .addCase(HelpCard.Actions.Hide.type, (state, { payload }: HelpCard.Actions.Hide) => {
      const { helpCardId } = payload;
      state.hideHelpCard[helpCardId] = true;
    })
    .addCase(Persist.Actions.Set.type, (state, { payload }: Persist.Actions.Set) => {
      const { persistKey, value } = payload;
      state[persistKey] = value;
    }),
});

function userRefreshed(
  state: WritableDraft<LocalStorageState>,
  payload: {
    userData: ApiUser
    localStorage: LocalStorageState
  },
) {
  const { userData, localStorage } = payload;
  const loggedInState = getLoggedInState(userData, localStorage);
  state.orgId = loggedInState.activeRole?.role.org?.id;
}
