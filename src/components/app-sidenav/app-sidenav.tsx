import React from 'react';
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import HomeIcon from '@material-ui/icons/Home';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import SecurityIcon from '@material-ui/icons/Security';
import HelpIcon from '@material-ui/icons/Help';
import ViewWeekOutlinedIcon from '@material-ui/icons/ViewWeekOutlined';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import clsx from 'clsx';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppFrameState } from '../../reducers/app-frame.reducer';
import { UserState } from '../../reducers/user.reducer';
import { UserSelector } from '../../selectors/user.selector';
import { AppState } from '../../store';
import { PersonCheckIcon } from '../icons/person-check-icon';
import {
  Link,
  LinkProps,
} from '../link/link';
import useStyles from './app-sidenav.styles';
import { AppFrame } from '../../actions/app-frame.actions';
import { DataExportIcon } from '../icons/data-export-icon';

type SidenavLinkProps = {
  name: string,
  icon: any,
} & LinkProps;

const SidenavLink = (props: SidenavLinkProps) => {
  const {
    name,
    icon,
  } = props;
  const classes = useStyles();
  const location = useLocation();

  const isActive = () => {
    // Only internal links can be active.
    if ('to' in props) {
      return location.pathname.endsWith(props.to as string);
    }

    return false;
  };

  return (
    <Link
      className={isActive() ? classes.activeLink : classes.inactiveLink}
      {...props}
    >
      <ListItem button key={name}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    </Link>
  );
};

export const AppSidenav = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector<AppState, UserState>(state => state.user);
  const orgId = useSelector(UserSelector.orgId);
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
            to="/home"
            name="Home"
            icon={(<HomeIcon />)}
          />
          {user.activeRole?.role.workspace && (
            <SidenavLink
              href={`/dashboard?orgId=${orgId}`}
              name="Analytics"
              icon={(<BarChartIcon />)}
            />
          )}
          {user.activeRole?.role.workspace && (
            <SidenavLink
              to="/data-export"
              name="Data Export"
              icon={(<DataExportIcon />)}
            />
          )}
          {user.activeRole?.role.canViewMuster && (
            <SidenavLink
              to="/muster"
              name="Muster"
              icon={(<PersonCheckIcon />)}
            />
          )}
          {user.activeRole?.role.canViewRoster && (
            <SidenavLink
              to="/roster"
              name="Roster"
              icon={(<AssignmentIndIcon />)}
            />
          )}
        </List>

        {user.activeRole?.role.canManageGroup && (
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
                to="/units"
                name="Units"
                icon={(<GroupWorkIcon />)}
              />
              <SidenavLink
                to="/users"
                name="Users"
                icon={(<SupervisorAccountIcon />)}
              />
              <SidenavLink
                to="/roles"
                name="Roles"
                icon={(<SecurityIcon />)}
              />
              <SidenavLink
                to="/roster-columns"
                name="Roster Columns"
                icon={(<ViewWeekOutlinedIcon />)}
              />
              <SidenavLink
                to="/workspaces"
                name="Workspaces"
                icon={(<DashboardOutlinedIcon />)}
              />
            </List>
          </>
        )}

        <>
          <div className={clsx(classes.header, {
            [classes.headerExpanded]: appFrame.sidenavExpanded,
            [classes.headerCollapsed]: !appFrame.sidenavExpanded,
          })}
          >
            Help & Resources
          </div>

          <List>
            <SidenavLink
              href={`${process.env.REACT_APP_ONBOARDING_LINK}`}
              target="_blank"
              rel="noreferrer"
              name="Onboarding"
              icon={(<HelpIcon />)}
            />
          </List>
        </>
      </Drawer>
    </div>
  );
};
