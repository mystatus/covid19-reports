import {
  AppBar, Avatar, Button, Divider, Menu, MenuItem, Toolbar,
} from '@material-ui/core';
import { ArrowDropDown, Settings } from '@material-ui/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Md5 } from 'ts-md5/dist/md5';
import { Link } from '../link/link';
import { User } from '../../actions/user.actions';
import { UserState } from '../../reducers/user.reducer';
import { AppState } from '../../store';
import useStyles from './app-toolbar.styles';
import logoImage from '../../media/images/logo.png';

export const AppToolbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector<AppState, UserState>(state => state.user);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [orgMenuAnchor, setOrgMenuAnchor] = React.useState<HTMLElement | null>(null);

  const handleOrgChanged = (id: number) => () => {
    dispatch(User.changeOrg(id));
    setOrgMenuAnchor(null);
  };

  const getAvatarURL = () => {
    const md5 = new Md5();
    md5.appendStr(user.email.trim().toLowerCase());
    const hash = md5.end() as string;
    return `https://www.gravatar.com/avatar/${hash}?d=404&s=64`;
  };

  return (
    <>
      <AppBar
        position="fixed"
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <img className={classes.logo} src={logoImage} alt="StatusEngine Logo" height="35" />
          <div className={classes.spacer} />
          {user.activeRole && user.userRoles && (
            <>
              <Button
                className={classes.toolbarButton}
                variant="text"
                onClick={e => setOrgMenuAnchor(e.currentTarget)}
                endIcon={<ArrowDropDown />}
              >
                {`${user.activeRole.role.org?.name}`}
              </Button>
              <Menu
                open={Boolean(orgMenuAnchor)}
                onClose={() => setOrgMenuAnchor(null)}
                anchorEl={orgMenuAnchor}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                className={classes.toolbarMenu}
              >
                {user.userRoles.map(userRole => (
                  <MenuItem
                    key={userRole.role.id}
                    selected={user.activeRole!.role.org!.id === userRole.role.org!.id}
                    onClick={handleOrgChanged(userRole.role.org!.id)}
                  >
                    {userRole.role.org!.name}
                  </MenuItem>
                ))}
                <Divider />
                <Link to="/groups" onClick={() => setOrgMenuAnchor(null)}>
                  <MenuItem>
                    Other Groups
                  </MenuItem>
                </Link>
              </Menu>
            </>
          )}

          <Divider orientation="vertical" flexItem className={classes.toolbarDivider} />

          <Button
            className={classes.toolbarButton}
            variant="text"
            onClick={e => setUserMenuAnchor(e.currentTarget)}
            endIcon={<ArrowDropDown />}
          >
            <Avatar alt={user.firstName} src={getAvatarURL()}>
              {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
            </Avatar> {`${user.firstName} ${user.lastName}`}
          </Button>
          <Menu
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
            anchorEl={userMenuAnchor}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            className={classes.toolbarMenu}
          >
            <Link to="/settings" onClick={() => setUserMenuAnchor(null)}>
              <MenuItem>
                <Settings className={classes.userMenuIcon} />
                Settings
              </MenuItem>
            </Link>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Empty toolbar used for spacing purposes */}
      <Toolbar />
    </>
  );
};
