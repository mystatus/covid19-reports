import React, { useEffect } from 'react';
import {
  Badge,
  BadgeProps,
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
import { useLocation } from 'react-router-dom';
import { OrphanedRecordSelector } from '../../selectors/orphaned-record.selector';
import { UserSelector } from '../../selectors/user.selector';
import { PersonCheckIcon } from '../icons/person-check-icon';
import {
  Link,
  LinkProps,
} from '../link/link';
import useStyles from './app-sidenav.styles';
import { OrphanedRecordActions } from '../../slices/orphaned-record.slice';
import { DataExportIcon } from '../icons/data-export-icon';
import { AppFrameActions } from '../../slices/app-frame.slice';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { useAppSelector } from '../../hooks/use-app-selector';

type SidenavLinkProps = {
  name: string;
  icon: any;
  badgeColor?: BadgeProps['color'];
  badgeContent?: React.ReactNode;
} & LinkProps;

const SidenavLink = (props: SidenavLinkProps) => {
  const {
    name,
    icon,
    badgeColor = 'error',
    badgeContent = 0,
    ...rest
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
      {...rest}
    >
      <ListItem button key={name}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
        <Badge color={badgeColor} badgeContent={badgeContent} max={999} className={classes.badge} />
      </ListItem>
    </Link>
  );
};

export const AppSidenav = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const orgId = useAppSelector(UserSelector.orgId);
  const appFrame = useAppSelector(state => state.appFrame);
  const orphanedRecords = useAppSelector(OrphanedRecordSelector.root);

  const toggleSidenav = () => {
    dispatch(AppFrameActions.toggleSidenavExpanded());
  };

  useEffect(() => {
    if (user.activeRole?.role.canManageRoster) {
      void dispatch(OrphanedRecordActions.fetchCount({ orgId: orgId! }));
    } else {
      dispatch(OrphanedRecordActions.clear());
    }
  }, [orgId, dispatch, user]);

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
          {user.activeRole?.role.canViewMuster && (
            <SidenavLink
              to="/muster"
              name="Muster"
              icon={(<PersonCheckIcon />)}
            />
          )}
          {/* {user.activeRole?.role.canViewObservations && ( */}
          <SidenavLink
            to="/observations"
            name="Observations"
            icon={(<AssignmentIndIcon />)}
          />
          {/* )} */}
          {user.activeRole?.role.canViewRoster && (
            <SidenavLink
              to="/roster"
              name="Roster"
              icon={(<AssignmentIndIcon />)}
              badgeContent={orphanedRecords.count}
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
                to="/muster-config"
                name="Muster Configuration"
                icon={(<PersonCheckIcon />)}
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
              href="/onboarding-doc"
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
