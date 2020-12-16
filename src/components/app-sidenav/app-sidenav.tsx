import React from 'react';
import {
  Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import HomeIcon from '@material-ui/icons/Home';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import SecurityIcon from '@material-ui/icons/Security';
import ReplyAllIcon from '@material-ui/icons/ReplyAll';
import ViewWeekOutlinedIcon from '@material-ui/icons/ViewWeekOutlined';
import DashboardoutlinedIcon from '@material-ui/icons/Dashboardoutlined';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { AppFrameState } from '../../reducers/app-frame.reducer';
import { UserState } from '../../reducers/user.reducer';
import { AppState } from '../../store';
import { PersonCheckIcon } from '../icons/person-check-icon';
import useStyles from './app-sidenav.styles';
import { AppFrame } from '../../actions/app-frame.actions';

interface SidenavLinkProps {
  route: string,
  name: string,
  icon: any,
  external?: boolean,
}

const SidenavLink = (props: SidenavLinkProps) => {
  const classes = useStyles();
  const location = useLocation();
  const isActive = () => {
    return location.pathname.endsWith(props.route);
  };
  const inner = () => {
    return (
      <ListItem button key={props.name}>
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText primary={props.name} />
      </ListItem>
    );
  };

  return (
    <>
      {props.external && (
        <a href={props.route} className={isActive() ? classes.activeLink : classes.inactiveLink}>
          {inner()}
        </a>
      )}
      {!props.external && (
        <Link to={props.route} className={isActive() ? classes.activeLink : classes.inactiveLink}>
          {inner()}
        </Link>
      )}
    </>
  );
};

export const AppSidenav = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector<AppState, UserState>(state => state.user);
  const appFrame = useSelector<AppState, AppFrameState>(state => state.appFrame);

  const toggleSidenav = () => {
    dispatch(AppFrame.toggleSidenavExpanded());
  };

  return (
    <div className={classes.root}>
      <div className={clsx(classes.expander, {
        [classes.expanderExpanded]: appFrame.sidenavExpanded,
        [classes.expanderCollapsed]: !appFrame.sidenavExpanded,
      })}
      >
        <IconButton onClick={toggleSidenav} aria-label="Toggle" size="small">
          <NavigateBeforeIcon fontSize="inherit" />
        </IconButton>
      </div>

      <Drawer
        variant="permanent"
        className={clsx(classes.sidenav, {
          [classes.sidenavExpanded]: appFrame.sidenavExpanded,
          [classes.sidenavCollapsed]: !appFrame.sidenavExpanded,
        })}
        classes={{
          paper: clsx({
            [classes.sidenavExpanded]: appFrame.sidenavExpanded,
            [classes.sidenavCollapsed]: !appFrame.sidenavExpanded,
          }),
        }}
      >
        <Divider />

        <List>
          <SidenavLink
            route="/home"
            name="Home"
            icon={(<HomeIcon />)}
          />
          {user.activeRole?.workspace && (
            <SidenavLink
              external
              route={`/dashboard?orgId=${user.activeRole?.org?.id}`}
              name="Analytics"
              icon={(<BarChartIcon />)}
            />
          )}
          {user.activeRole?.workspace && (
            <SidenavLink
              route="/data-export"
              name="Data Export"
              icon={(<ReplyAllIcon className={classes.dataExportIcon} />)}
            />
          )}
          {user.activeRole?.canViewMuster && (
            <SidenavLink
              route="/muster"
              name="Muster"
              icon={(<PersonCheckIcon />)}
            />
          )}
          {user.activeRole?.canViewRoster && (
            <SidenavLink
              route="/roster"
              name="Roster"
              icon={(<AssignmentIndIcon />)}
            />
          )}
        </List>

        {user.activeRole?.canManageGroup && (
          <>
            <div className={clsx(classes.header, {
              [classes.headerExpanded]: appFrame.sidenavExpanded,
              [classes.headerCollapsed]: !appFrame.sidenavExpanded,
            })}
            >
              Management
            </div>

            <List>
              <SidenavLink
                route="/units"
                name="Units"
                icon={(<GroupWorkIcon />)}
              />
              <SidenavLink
                route="/users"
                name="Users"
                icon={(<SupervisorAccountIcon />)}
              />
              <SidenavLink
                route="/roles"
                name="Roles"
                icon={(<SecurityIcon />)}
              />
              <SidenavLink
                route="/roster-columns"
                name="Roster Columns"
                icon={(<ViewWeekOutlinedIcon />)}
              />
              <SidenavLink
                route="/workspaces"
                name="Workspaces"
                icon={(<DashboardoutlinedIcon />)}
              />
            </List>
          </>
        )}
      </Drawer>
    </div>
  );
};
