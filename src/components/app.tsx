import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { User } from '../actions/user.actions';
import { AppFrameState } from '../reducers/app-frame.reducer';
import { UserState } from '../reducers/user.reducer';
import { AppState } from '../store';
import { AppSidenav } from './app-sidenav/app-sidenav';
import { AppToolbar } from './app-toolbar/app-toolbar';
import { HomePage } from './pages/home-page/home-page';
import useStyles from './app.styles';
import { GroupsPage } from './pages/groups-page/groups-page';
import { MusterPage } from './pages/muster-page/muster-page';
import { RosterPage } from './pages/roster-page/roster-page';
import { UserRegistrationPage } from './pages/user-registration-page/user-registration-page';
import { UsersPage } from './pages/users-page/users-page';
import { RoleManagementPage } from './pages/role-management-page/role-management-page';
import { WorkspacesPage } from './pages/workspaces-page/workspaces-page';
import { RosterColumnsPage } from './pages/roster-columns-page/roster-columns-page';
import { SettingsPage } from './pages/settings-page/settings-page';
import { UnitsPage } from './pages/units-page/units-page';
import { ErrorBoundary } from './error-boundary/error-boundary';
import { AlertDialogProps } from './alert-dialog/alert-dialog';

export const App = () => {
  const user = useSelector<AppState, UserState>(state => state.user);
  const appFrame = useSelector<AppState, AppFrameState>(state => state.appFrame);
  const dispatch = useDispatch();
  const classes = useStyles();

  const [alertDialogProps, setAlertDialogProps] = useState<AlertDialogProps>({ open: false });

  useEffect(() => {
    dispatch(User.login());
  }, [dispatch]);

  function routes() {
    if (!user.isLoggedIn) {
      // TODO: Show spinner here.
      return <></>;
    }

    if (!user.isRegistered) {
      return (
        <Switch>
          <Route path="/register">
            <UserRegistrationPage />
          </Route>
          <Redirect to="/register" />
        </Switch>
      );
    }

    if (!user.activeRole) {
      return (
        <>
          <AppToolbar />

          <Switch>
            <Route path="/groups">
              <GroupsPage />
            </Route>
            <Redirect to="/groups" />
          </Switch>
        </>
      );
    }

    return (
      <>
        <AppToolbar />
        <AppSidenav />

        <div
          className={clsx(classes.content, {
            [classes.contentSidenavCollapsed]: !appFrame.sidenavExpanded,
            [classes.contentSidenavExpanded]: appFrame.sidenavExpanded,
          })}
        >
          <div
            className={clsx({
              [classes.contentFaded]: appFrame.isPageLoading,
            })}
          >
            <Switch>
              <Route path="/home">
                <HomePage />
              </Route>
              <Route path="/units">
                <UnitsPage />
              </Route>
              <Route path="/roster">
                <RosterPage />
              </Route>
              <Route path="/roster-columns">
                <RosterColumnsPage />
              </Route>
              <Route path="/workspaces">
                <WorkspacesPage />
              </Route>
              <Route path="/roles">
                <RoleManagementPage />
              </Route>
              <Route path="/users">
                <UsersPage />
              </Route>
              <Route path="/groups">
                <GroupsPage />
              </Route>
              <Route path="/settings">
                <SettingsPage />
              </Route>
              <Route path="/muster">
                <MusterPage />
              </Route>
              <Route path="/*">
                <Redirect to="/home" />
              </Route>
            </Switch>
          </div>

          <div
            className={clsx(classes.content, {
              [classes.fixedContentCenteredSidenavCollapsed]: !appFrame.sidenavExpanded,
              [classes.fixedContentCenteredSidenavExpanded]: appFrame.sidenavExpanded,
            })}
          >
            { appFrame.isPageLoading ? <CircularProgress /> : '' }
          </div>

        </div>

      </>
    );
  }

  return (
    <ErrorBoundary
      alertDialogProps={alertDialogProps}
      setAlertDialogProps={setAlertDialogProps}
    >
      {routes()}
    </ErrorBoundary>
  );
};
