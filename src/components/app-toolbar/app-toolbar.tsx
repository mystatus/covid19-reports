import {
  AppBar, MenuItem, Select, Toolbar,
} from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../../actions/user.actions';
import { UserState } from '../../reducers/user.reducer';
import { AppState } from '../../store';
import useStyles from './app-toolbar.styles';
import logoImage from '../../media/images/logo.png';

export const AppToolbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userState = useSelector<AppState, UserState>(state => state.userState);

  function handleOrgChanged(event: React.ChangeEvent<{ value: unknown }>) {
    dispatch(User.changeOrg(event.target.value as number));
  }

  return (
    <>
      <AppBar
        position="fixed"
        className={classes.appBar}
      >
        <Toolbar>
          <img className={classes.logo} src={logoImage} alt="StatusEngine Logo" height="35" />

          {userState.activeRole && userState.user?.roles && userState.user.roles.length > 1 && (
            <Select
              className={classes.orgSelect}
              labelId="org-select-label"
              id="org-select"
              value={userState.activeRole.org?.id}
              onChange={handleOrgChanged}
              inputProps={{
                classes: {
                  icon: classes.orgSelectIcon,
                },
              }}
            >
              {userState.user.roles.map(role => (
                <MenuItem value={role.org?.id} key={role.org?.id}>{role.org?.name}</MenuItem>
              ))}
            </Select>
          )}
        </Toolbar>
      </AppBar>

      {/* Extra empty toolbar to provide proper padding */}
      <Toolbar />
    </>
  );
};
