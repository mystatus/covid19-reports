import clsx from 'clsx';
import React, { useEffect } from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { useAppDispatch} from '../hooks/use-app-dispatch';
import { UserActions } from '../slices/user.slice';
import { AppSidenav } from './app-sidenav/app-sidenav';
import { AppToolbar } from './app-toolbar/app-toolbar';
import { SpacesPage } from './pages/spaces-page/spaces-page';
import { DataExportPage } from './pages/data-export-page/data-export-page';
import { HomePage } from './pages/home-page/home-page';
import useStyles from './app.styles';
import { GroupsPage } from './pages/groups-page/groups-page';
import { MusterPage } from './pages/muster-page/muster-page';
import { RosterPage } from './pages/roster-page/roster-page';
import { UserRegistrationPage } from './pages/user-registration-page/user-registration-page';
import { UsersPage } from './pages/users-page/users-page';
import { RoleManagementPage } from './pages/role-management-page/role-management-page';
import { EditSpacesPage } from './pages/edit-spaces-page/edit-spaces-page';
import { RosterColumnsPage } from './pages/roster-columns-page/roster-columns-page';
import { SettingsPage } from './pages/settings-page/settings-page';
import { UnitsPage } from './pages/units-page/units-page';
import { useAppSelector } from '../hooks/use-app-selector';

export const App = () => {
  const user = useAppSelector(state => state.user);
  const appFrame = useAppSelector(state => state.appFrame);
  const dispatch = useAppDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(UserActions.refresh());
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
              <Route path="/edit-spaces">
                <EditSpacesPage />
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
              <Route path="/data-export">
                <DataExportPage />
              </Route>
              <Route path="/spaces">
                <SpacesPage />
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
    <>
      {routes()}
    </>
  );
};
