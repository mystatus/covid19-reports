import { createReducer } from '@reduxjs/toolkit';
import { HelpCard } from '../actions/help-card.actions';
import { Persist } from '../actions/persist.actions';
import { User } from '../actions/user.actions';
import { UserActions } from '../slices/user.slice';
import { Dict } from '../utility/typescript-utils';
import { getLoggedInState } from '../utility/user-utils';

// We need to be careful about what goes into local storage due to security concerns. So make sure not to add anything
// that is clearly identifying of groups, units, or individuals, such as PII/PHI data, group name, etc.
export interface LocalStorageState extends Record<string, any>{
  orgId?: number
  hideHelpCard?: Dict<boolean>
}

export const localStorageInitialState: LocalStorageState = {};

export const localStorageReducer = createReducer(localStorageInitialState, builder => {
  builder.addCase(UserActions.refresh.fulfilled, (state, action) => {
    const { userData, localStorage } = action.payload;
    const loggedInState = getLoggedInState(userData, localStorage);
    return {
      ...state,
      orgId: loggedInState.activeRole?.role.org?.id,
    };
  })
    .addCase(UserActions.register.fulfilled, (state, action) => {
      const { userData, localStorage } = (action as User.Actions.Register).payload;
      const loggedInState = getLoggedInState(userData, localStorage);
      return {
        ...state,
        orgId: loggedInState.activeRole?.role.org?.id,
      };
    })
    .addCase(UserActions.logout.type, () => {
      return localStorageInitialState;
    })
    .addCase(UserActions.changeOrg.type, (state, action) => {
      const { orgId } = (action as User.Actions.ChangeOrg).payload;
      return {
        ...state,
        orgId,
      };
    })
    .addCase(HelpCard.Actions.Hide.type, (state, action) => {
      const { helpCardId } = (action as HelpCard.Actions.Hide).payload;
      return {
        ...state,
        hideHelpCard: {
          ...state.hideHelpCard,
          [helpCardId]: true,
        },
      };
    })
    .addCase(Persist.Actions.Set.type, (state, action) => {
      const { persistKey, value } = (action as Persist.Actions.Set).payload;
      return {
        ...state,
        [persistKey]: value,
      };
    })
    .addDefaultCase(state => state);
});
