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
import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import useStyles from './users-page.styles';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import { ApiRole, ApiUser, ApiAccessRequest } from '../../../models/api-response';
import { AppFrame } from '../../../actions/app-frame.actions';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { AlertDialog, AlertDialogProps } from '../../alert-dialog/alert-dialog';
import SelectRoleDialog from './select-role-dialog';

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

interface AccessRequestRow extends ApiAccessRequest {
  waiting?: boolean,
}

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
  const [activeAccessRequest, setActiveAccessRequest] = useState<AccessRequestRow | undefined>();
  const [userRows, setUserRows] = useState<ApiUser[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequestRow[]>([]);
  const [finalizeApprovalLoading, setFinalizeApprovalLoading] = useState(false);
  const [denyRequestsLoading, setDenyRequestsLoading] = useState({} as ({[rowId: number]: boolean}));
  const [userMoreMenu, setUserMenu] = React.useState<null | UserMoreMenuState>(null);
  const [alertDialogProps, setAlertDialogProps] = useState<AlertDialogProps>({ open: false });
  const { id: orgId, name: orgName } = useSelector<AppState, UserState>(state => state.user).activeRole?.org ?? {};

  const initializeTable = React.useCallback(async () => {
    try {
      dispatch(AppFrame.setPageLoading(true));
      const [users, requests] = await Promise.all([
        axios.get(`api/user/${orgId}`),
        axios.get(`api/access-request/${orgId}`),
      ]);
      setUserRows(users.data as ApiUser[]);
      setAccessRequests(requests.data as AccessRequestRow[]);
    } catch (_) {
      // Error handling? This should probably retry
    }
    dispatch(AppFrame.setPageLoading(false));
  }, [orgId, dispatch]);

  const showAlertDialog = (error: AxiosError | Error, title: string, message: string) => {
    let errorMessage = 'Internal Server Error';
    const axiosError = error as AxiosError;
    if (axiosError?.response?.data?.errors && axiosError?.response.data.errors.length > 0) {
      errorMessage = axiosError?.response.data.errors[0].message;
    }
    setAlertDialogProps({
      open: true,
      title,
      message: `${message}${errorMessage ? `: ${errorMessage}` : ''}`,
      onClose: () => { setAlertDialogProps({ open: false }); },
    });
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

  const handleUserMoreClose = () => setUserMenu(null);
  const patchMoreMenuState = (patch: Partial<UserMoreMenuState>) => setUserMenu(state => ({ ...state, ...patch } as UserMoreMenuState));

  const handleRemoveFromGroup = () => patchMoreMenuState({ showRemoveUserFromGroup: true, element: undefined });
  const cancelRemoveFromGroup = () => patchMoreMenuState({ showRemoveUserFromGroup: false });
  const acceptRemoveFromGroup = async () => {
    try {
      patchMoreMenuState({ loading: true });
      await axios.delete(`api/user/${orgId}/${userMoreMenu!.user.edipi}`);
    } catch (error) {
      showAlertDialog(error, 'Remove User from Group', 'Unable to remove user from group');
    }
    patchMoreMenuState({ loading: false, showRemoveUserFromGroup: false });
    await initializeTable();
  };

  const handleChangeRole = () => patchMoreMenuState({ element: undefined, showChangeUserRole: true });
  const cancelChangeRole = () => patchMoreMenuState({ showChangeUserRole: false });
  const acceptChangeRole = async (role: ApiRole) => {
    try {
      patchMoreMenuState({ loading: true });
      await axios.post(`api/user/${orgId}`, {
        firstName: userMoreMenu!.user.firstName,
        lastName: userMoreMenu!.user.lastName,
        edipi: userMoreMenu!.user.edipi,
        role: role.id,
      });
    } catch (error) {
      showAlertDialog(error, 'Change User Role', 'Unable to change role');
    }
    patchMoreMenuState({ loading: false, showChangeUserRole: false });
    await initializeTable();
  };

  function updateDenyRequestLoading(rowId: number, isLoading: boolean) {
    setDenyRequestsLoading({
      ...denyRequestsLoading,
      [rowId]: isLoading,
    });
    setAccessRequestWaiting(rowId, isLoading);
  }

  function setAccessRequestWaiting(rowId: number | undefined, isLoading: boolean) {
    let result: AccessRequestRow | undefined;
    setAccessRequests(requests => {
      return requests.map(request => {
        if (request.id === rowId) {
          request.waiting = isLoading;
          result = request;
        }
        return request;
      });
    });
    return result;
  }

  function cancelRoleSelection() {
    setAccessRequestWaiting(activeAccessRequest?.id, false);
    setActiveAccessRequest(undefined);
  }

  async function acceptRoleSelection(role: ApiRole) {
    try {
      setFinalizeApprovalLoading(true);
      if (activeAccessRequest) {
        await axios.post(`api/access-request/${orgId}/approve`, {
          requestId: activeAccessRequest.id,
          roleId: role.id,
        });
      }
    } catch (error) {
      showAlertDialog(error, 'Approve Access Request', 'Error while approving accessing request');
    }
    await initializeTable();
    setFinalizeApprovalLoading(false);
    setActiveAccessRequest(undefined);
  }

  function acceptRequest(id: number) {
    setActiveAccessRequest(setAccessRequestWaiting(id, true));
  }

  async function denyRequest(id: number) {
    try {
      updateDenyRequestLoading(id, true);
      await axios.post(`api/access-request/${orgId}/deny`, {
        requestId: id,
      });
    } catch (error) {
      showAlertDialog(error, 'Deny Access Request', 'Error while denying accessing request');
    }
    await initializeTable();
    updateDenyRequestLoading(id, false);
  }

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <h1>Users</h1>
        {accessRequests.length > 0 && (
          <TableContainer className={classes.table} component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow className={classes.tableHeader}>
                  <TableCell colSpan={6}>
                    <h2>Access Requests</h2>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>EDIPI</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accessRequests.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {`${row.user.firstName} ${row.user.lastName}`}
                    </TableCell>
                    <TableCell>{row.user.edipi}</TableCell>
                    <TableCell>{row.user.service}</TableCell>
                    <TableCell>
                      <IconButton aria-label="expand row" size="small" href={`mailto:${row.user.email}`}>
                        <MailOutlineIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>{row.user.phone}</TableCell>
                    <TableCell className={classes.accessRequestButtons}>
                      <Button
                        variant="contained"
                        disabled={row.waiting}
                        className={classes.accessRequestApproveButton}
                        onClick={() => { acceptRequest(row.id); }}
                      >
                        Approve
                      </Button>
                      <ButtonWithSpinner
                        variant="contained"
                        disabled={row.waiting}
                        className={classes.accessRequestDenyButton}
                        onClick={async () => { await denyRequest(row.id); }}
                        loading={denyRequestsLoading[row.id]}
                      >
                        Deny
                      </ButtonWithSpinner>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TableContainer className={classes.table} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow className={classes.tableHeader}>
                <TableCell colSpan={7}>
                  <h2>All Users</h2>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>EDIPI</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>
                  <Menu
                    id="user-more-menu"
                    anchorEl={userMoreMenu?.element}
                    keepMounted
                    open={Boolean(userMoreMenu?.element)}
                    onClose={handleUserMoreClose}
                  >
                    <MenuItem onClick={handleRemoveFromGroup}>Remove from Group</MenuItem>
                    <MenuItem onClick={handleChangeRole}>Change Role</MenuItem>
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
                  <TableCell>{row.service}</TableCell>
                  <TableCell>
                    <IconButton aria-label="expand row" size="small" href={`mailto:${row.email}`}>
                      <MailOutlineIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.roles ? row.roles[0].name : 'Unknown'}</TableCell>
                  <TableCell align="right" padding="none" size="small">
                    <IconButton
                      aria-label="more"
                      aria-controls="user-more-menu"
                      aria-haspopup="true"
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
      <SelectRoleDialog
        confirmButtonText="Finalize Approval"
        loading={finalizeApprovalLoading}
        onCancel={cancelRoleSelection}
        onChange={acceptRoleSelection}
        open={Boolean(activeAccessRequest)}
        user={activeAccessRequest?.user}
      />
      <SelectRoleDialog
        confirmButtonText="Confirm Role Change"
        loading={Boolean(userMoreMenu?.loading)}
        onCancel={cancelChangeRole}
        onChange={acceptChangeRole}
        open={Boolean(userMoreMenu?.showChangeUserRole)}
        user={userMoreMenu?.user}
      />
      {alertDialogProps.open && (
        <AlertDialog
          open={alertDialogProps.open}
          title={alertDialogProps.title}
          message={alertDialogProps.message}
          onClose={alertDialogProps.onClose}
        />
      )}
    </main>
  );
};
