import {
  Button,
  Container,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import client, { AccessRequestClient, UserClient } from '../../../client';
import PageHeader from '../../page-header/page-header';
import { UsersPageHelp } from './users-page-help';
import useStyles from './users-page.styles';
import { ApiRole, ApiUser, ApiAccessRequest } from '../../../models/api-response';
import { AppFrame } from '../../../actions/app-frame.actions';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import SelectRoleDialog, { SelectRoleDialogProps } from './select-role-dialog';
import { formatMessage } from '../../../utility/errors';
import { UserSelector } from '../../../selectors/user.selector';
import { Modal } from '../../../actions/modal.actions';
import { UnitSelector } from '../../../selectors/unit.selector';
import { Unit } from '../../../actions/unit.actions';
import { ViewAccessRequestDialog } from './view-access-request-dialog';

type UserMoreMenuState = {
  element: HTMLElement
  loading: boolean
  showChangeUserRole: Boolean
  showRemoveUserFromGroup: Boolean
  user: ApiUser
};

export const UsersPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const units = useSelector(UnitSelector.all);
  const [userRows, setUserRows] = useState<ApiUser[]>([]);
  const [accessRequests, setAccessRequests] = useState<ApiAccessRequest[]>([]);
  const [userMoreMenu, setUserMenu] = React.useState<UserMoreMenuState | undefined>();
  const [selectRoleDialogProps, setSelectRoleDialogProps] = useState<Partial<SelectRoleDialogProps> | undefined>();
  const [viewAccessRequestDialogProps, setViewAccessRequestDialogProps] = useState({
    open: false,
    accessRequest: undefined as ApiAccessRequest | undefined,
  });

  const { edipi: currentUserEdipi } = useSelector(UserSelector.current);
  const { id: orgId, name: orgName } = useSelector(UserSelector.org) ?? {};

  const initializeTable = React.useCallback(async () => {
    if (orgId) {
      try {
        dispatch(AppFrame.setPageLoading(true));
        dispatch(Unit.fetch(orgId));
        const [users, requests] = await Promise.all([
          UserClient.fetchAll(orgId!),
          AccessRequestClient.fetchAll(orgId!),
        ]);
        setUserRows(users as ApiUser[]);
        setAccessRequests(requests);
        setSelectRoleDialogProps(undefined);
      } catch (_) {
        // Error handling? This should probably just retry?
      }
      dispatch(AppFrame.setPageLoading(false));
    }
  }, [orgId, dispatch]);

  const showAlertDialog = (error: Error, title: string, message: string) => {
    dispatch(Modal.alert(title, formatMessage(error, message))).then();
  };

  const makeHandleUserMoreClick = (user: ApiUser) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserMenu({
      element: event.currentTarget,
      loading: false,
      showChangeUserRole: false,
      showRemoveUserFromGroup: false,
      user,
    });
  };

  const patchMoreMenuState = (patch: Partial<UserMoreMenuState>) => setUserMenu(state => ({ ...state, ...patch } as UserMoreMenuState));
  const handleUserMoreClose = () => patchMoreMenuState({ element: undefined });

  const handleRemoveFromGroup = () => patchMoreMenuState({ showRemoveUserFromGroup: true, element: undefined });
  const cancelRemoveFromGroup = () => patchMoreMenuState({ showRemoveUserFromGroup: false });
  const acceptRemoveFromGroup = async () => {
    try {
      patchMoreMenuState({ loading: true });
      await client.delete(`user/${orgId}/${userMoreMenu!.user.edipi}`);
    } catch (error) {
      showAlertDialog(error, 'Remove User from Group', 'Unable to remove user from group');
    }
    patchMoreMenuState({ loading: false, showRemoveUserFromGroup: false });
    await initializeTable();
  };

  const handleChangeRole = () => {
    patchMoreMenuState({ element: undefined, showChangeUserRole: true });
    setSelectRoleDialogProps({
      confirmButtonText: 'Confirm Role Change',
      loading: Boolean(userMoreMenu?.loading),
      units,
      onCancel: () => {
        patchMoreMenuState({ showChangeUserRole: false });
        setSelectRoleDialogProps(undefined);
      },
      onChange: async (role: ApiRole, unitIds: number[] | null) => {
        try {
          patchMoreMenuState({ loading: true });
          await client.post(`user/${orgId}`, {
            firstName: userMoreMenu!.user.firstName,
            lastName: userMoreMenu!.user.lastName,
            edipi: userMoreMenu!.user.edipi,
            role: role.id,
            units: unitIds == null ? [] : unitIds,
            allUnits: unitIds == null,
          });
        } catch (error) {
          showAlertDialog(error, 'Change User Role', 'Unable to change role');
        }
        patchMoreMenuState({ loading: false, showChangeUserRole: false });
        await initializeTable();
      },
      open: true,
      user: userMoreMenu?.user,
    });
  };

  function handleViewRequestClick(accessRequest: ApiAccessRequest) {
    setViewAccessRequestDialogProps({
      ...viewAccessRequestDialogProps,
      open: true,
      accessRequest,
    });
  }

  function getUserRole(user: ApiUser) {
    // Ever user will have exactly one role for the current org, roles for other orgs are not returned to the client
    return user.userRoles![0].role.name;
  }

  function getUserUnit(user: ApiUser) {
    if (user.userRoles![0].allUnits) {
      return 'All Units';
    }
    const userUnits = user.userRoles![0].units;
    if (userUnits.length === 0) {
      return 'None';
    }
    return userUnits.map(unit => unit.name).sort().join(', ');
  }

  function handleViewAccessRequestDialogClose() {
    setViewAccessRequestDialogProps({
      ...viewAccessRequestDialogProps,
      open: false,
    });
  }

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <PageHeader
          title="Users"
          help={{
            contentComponent: UsersPageHelp,
            cardId: 'usersPage',
          }}
        />

        {/* Access Requests */}
        {accessRequests.length > 0 && (
          <TableContainer className={classes.table} component={Paper}>
            <Table aria-label="access requests table">
              <TableHead>
                <TableRow className={classes.tableHeader}>
                  <TableCell colSpan={6}>
                    <h2>Access Requests</h2>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Sponsor</TableCell>
                  <TableCell>Justification</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accessRequests.map(accessRequest => (
                  <TableRow key={accessRequest.id}>
                    <TableCell component="th" scope="row">
                      {`${accessRequest.user.firstName} ${accessRequest.user.lastName}`}
                    </TableCell>
                    <TableCell>{accessRequest.sponsorName}</TableCell>
                    <TableCell>{accessRequest.justification}</TableCell>
                    <TableCell>
                      <Button variant="text" onClick={() => handleViewRequestClick(accessRequest)}>
                        View Request
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Users */}
        <TableContainer className={classes.table} component={Paper}>
          <Table aria-label="users table">
            <TableHead>
              <TableRow className={classes.tableHeader}>
                <TableCell colSpan={7}>
                  <h2>All Users</h2>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>EDIPI</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Unit(s)</TableCell>
                <TableCell>
                  <Menu
                    id="user-more-menu"
                    anchorEl={userMoreMenu?.element}
                    keepMounted
                    open={Boolean(userMoreMenu?.element)}
                    onClose={handleUserMoreClose}
                  >
                    <MenuItem onClick={handleRemoveFromGroup}>Remove from Group</MenuItem>
                    <MenuItem onClick={handleChangeRole}>Change Role/Unit</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userRows.map(row => (
                <TableRow key={row.edipi}>
                  <TableCell component="th" scope="row">
                    {`${row.firstName} ${row.lastName}`}
                  </TableCell>
                  <TableCell>{row.edipi}</TableCell>
                  <TableCell>
                    <IconButton aria-label="expand row" size="small" href={`mailto:${row.email}`}>
                      <MailOutlineIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{getUserRole(row)}</TableCell>
                  <TableCell>{getUserUnit(row)}</TableCell>
                  <TableCell align="right" padding="none" size="small">
                    <IconButton
                      aria-label="more"
                      aria-controls="user-more-menu"
                      aria-haspopup="true"
                      disabled={row.edipi === currentUserEdipi}
                      onClick={makeHandleUserMoreClick(row)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Remove User Dialog */}
      <Dialog onClose={cancelRemoveFromGroup} open={Boolean(userMoreMenu?.showRemoveUserFromGroup)}>
        <DialogContent className={classes.confirmRemoveFromGroupContent}>
          <ReportProblemOutlinedIcon className={classes.confirmRemoveFromGroupIcon} />
          <DialogContentText align="center" color="textPrimary">
            Are you sure you want to remove
            <b>{` ${userMoreMenu?.user.firstName} ${userMoreMenu?.user.lastName} `}</b>
            from the <span>{orgName}</span> group?
          </DialogContentText>
          <DialogActions className={classes.confirmRemoveFromGroupActions}>
            <Button disabled={Boolean(userMoreMenu?.loading)} variant="outlined" onClick={cancelRemoveFromGroup}>
              Cancel
            </Button>
            <ButtonWithSpinner
              className={classes.dangerButton}
              disabled={Boolean(userMoreMenu?.loading)}
              onClick={acceptRemoveFromGroup}
              loading={Boolean(userMoreMenu?.loading)}
            >
              Yes, Remove User from Group
            </ButtonWithSpinner>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {Boolean(selectRoleDialogProps?.open) && (
        <SelectRoleDialog
          {...(selectRoleDialogProps as SelectRoleDialogProps)}
        />
      )}

      {viewAccessRequestDialogProps.accessRequest && (
        <ViewAccessRequestDialog
          onClose={handleViewAccessRequestDialogClose}
          onComplete={initializeTable}
          open={viewAccessRequestDialogProps.open}
          accessRequest={viewAccessRequestDialogProps.accessRequest}
        />
      )}
    </main>
  );
};
