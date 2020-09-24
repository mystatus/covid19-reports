import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import {
  AppBar, Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import HomeIcon from '@material-ui/icons/Home';
import ListAltIcon from '@material-ui/icons/ListAlt';
import MenuIcon from '@material-ui/icons/Menu';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';

import { User } from '../actions/userActions';
import { UserState } from '../reducers/userReducer';
import { AppState } from '../store';
import { HomePage } from './pages/HomePage/HomePage';
import useStyles from './App.styles';
import { RosterPage } from './pages/RosterPage/RosterPage';
import { MusterPage } from './pages/MusterPage/MusterPage';
import {NotFoundPage} from "./pages/NotFoundPage/NotFoundPage";
import {UsersPage} from "./pages/UsersPage/UsersPage";

export const App = () => {
  const user = useSelector<AppState, UserState>(state => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  function toggleDrawerOpen() {
    setDrawerOpen(!drawerOpen);
  }

  function handleLogoutClick() {
    dispatch(User.logout());
  }

  useEffect(() => {
    dispatch(User.login());
  },[]);

  if (!user.isLoggedIn) {
    return (<></>);
  }

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawerOpen}
            edge="start"
            className={classes.menuButton}
          >
            <MenuIcon/>
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            DDS Covid Reporting
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          }),
        }}
      >
        <div className={classes.toolbar}>
        </div>
        <Divider/>
        <List>
          <Link to="/home">
            <ListItem button key="Home">
              <ListItemIcon><HomeIcon/></ListItemIcon>
              <ListItemText primary="Home"/>
            </ListItem>
          </Link>
          <Link to="/muster">
            <ListItem button key="Muster">
              <ListItemIcon><PersonIcon/></ListItemIcon>
              <ListItemText primary="Muster"/>
            </ListItem>
          </Link>
          <a href="/dashboard">
            <ListItem button key="Dashboard">
              <ListItemIcon><BarChartIcon/></ListItemIcon>
              <ListItemText primary="Dashboard"/>
            </ListItem>
          </a>

        </List>
        <Divider/>
        <List>
          {user.roles[0].canManageUsers &&
            <Link to="/users">
              <ListItem button key="Users">
                <ListItemIcon><PeopleIcon/></ListItemIcon>
                <ListItemText primary="Users"/>
              </ListItem>
            </Link>
          }

          {user.roles[0].canManageRoster &&
            <Link to="/roster">
              <ListItem button key="Roster">
                <ListItemIcon><ListAltIcon/></ListItemIcon>
                <ListItemText primary="Roster"/>
              </ListItem>
            </Link>
          }
        </List>
      </Drawer>

      <div
        className={clsx(classes.toolbar, {
        })}
      />

      <Switch>
        <Route path="/home">
          <HomePage/>
        </Route>
        <Route path="/muster">
          <MusterPage/>
        </Route>
        <Route path="/roster">
          <RosterPage/>
        </Route>
        <Route path="/users">
          <UsersPage/>
        </Route>
        <Redirect from="/" exact to="/home"/>
        <Route path="/*">
          <NotFoundPage/>
        </Route>
      </Switch>
    </>
  )
};

export default App;
