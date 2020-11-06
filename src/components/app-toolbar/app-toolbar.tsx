import {
  AppBar, Avatar, Button, Divider, Menu, MenuItem, Toolbar,
} from '@material-ui/core';
import { ArrowDropDown, CheckCircleOutline, Settings } from '@material-ui/icons';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Md5 } from 'ts-md5/dist/md5';
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
    return `https://www.gravatar.com/avatar/${hash}?d=404&s=32`;
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
          {user.activeRole && user.roles && (
            <>
              <Button
                className={classes.toolbarButton}
                variant="text"
                onClick={e => setOrgMenuAnchor(e.currentTarget)}
                endIcon={<ArrowDropDown />}
              >
                {`${user.activeRole.org?.name}`}
              </Button>
              <Menu
                open={Boolean(orgMenuAnchor)}
                onClose={() => setOrgMenuAnchor(null)}
                anchorEl={orgMenuAnchor}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                {user.roles.map(role => (
                  <MenuItem onClick={handleOrgChanged(role.org!.id)}>

                    {user.activeRole!.org!.id === role.org!.id ? (
                      <>
                        <div className={classes.activeGroup}>
                          <CheckCircleOutline />
                        </div>
                        <b>{role.org!.name}</b>
                      </>
                    ) : (
                      <>
                        <div className={classes.activeGroup} />
                        {role.org!.name}
                      </>
                    )}

                  </MenuItem>
                ))}
                <Divider />
                <MenuItem>
                  <div className={classes.activeGroup} />
                  <Link to="/groups" onClick={() => setOrgMenuAnchor(null)}>
                    Other Groups
                  </Link>
                </MenuItem>
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
          >
            <MenuItem>
              <Settings className={classes.userMenuIcon} />
              <Link to="/settings" onClick={() => setUserMenuAnchor(null)}>
                Settings
              </Link>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Empty toolbar used for spacing purposes */}
      <Toolbar />
    </>
  );
};
