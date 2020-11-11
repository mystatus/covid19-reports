import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { ApiRole, ApiRosterColumnInfo, ApiUser } from '../../../models/api-response';
import useStyles from './select-role-dialog.styles';
import { AppFrame } from '../../../actions/app-frame.actions';
import { allNotificationEvents } from '../../../models/notification-events';
import { AppState } from '../../../store';
import { UserState } from '../../../reducers/user.reducer';
import { parsePermissions } from '../../../utility/permission-set';

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

type SelectRoleDialogProps = {
  confirmButtonText: string
  loading: boolean
  onCancel?: () => void
  onChange: (selectedRole: ApiRole) => void
  open?: boolean
  user?: ApiUser
};

const SelectRoleDialog: React.FunctionComponent<SelectRoleDialogProps> = ({
  confirmButtonText,
  loading,
  onCancel,
  onChange,
  open,
  user,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [availableRoles, setAvailableRoles] = useState<ApiRole[]>([]);
  const [rosterColumns, setRosterColumns] = useState<ApiRosterColumnInfo[]>([]);
  const orgId = useSelector<AppState, UserState>(state => state.user).activeRole?.org?.id;

  useEffect(() => {
    if (availableRoles!.length > 0) {
      const roleId = user?.roles?.length ? user.roles[0].id : availableRoles[0].id;
      const roleIndex = availableRoles.findIndex(role => role.id === roleId);
      setSelectedRoleIndex(roleIndex >= 0 ? roleIndex : 0);
    }
  }, [user, availableRoles]);

  const initializeTable = React.useCallback(async () => {
    dispatch(AppFrame.setPageLoading(true));
    const [roles, columns] = await Promise.all([
      axios.get(`api/role/${orgId}`),
      axios.get(`api/roster/${orgId}/column`),
    ]);
    setAvailableRoles(roles.data as ApiRole[]);
    setRosterColumns(columns.data as ApiRosterColumnInfo[]);
    dispatch(AppFrame.setPageLoading(false));
  }, [orgId, dispatch]);

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  function selectedRoleChanged(event: React.ChangeEvent<{ value: unknown }>) {
    setSelectedRoleIndex(event.target.value as number);
  }

  if (availableRoles.length <= selectedRoleIndex) {
    return null;
  }

  const selectedRole = availableRoles[selectedRoleIndex];
  const permissions = parsePermissions(rosterColumns, selectedRole.allowedRosterColumns);

  const buildNotificationEventRows = () => {
    return allNotificationEvents.map(event => (
      <TableRow key={event.name}>
        <TableCell className={classes.rolePermissionCell}>
          {event.displayName}
        </TableCell>
        <TableCell className={classes.rolePermissionIconCell}>
          {selectedRole.allowedNotificationEvents.some(evt => evt === '*' || evt === event.name) && <CheckIcon />}
        </TableCell>
      </TableRow>
    ));
  };
  const columnAllowed = (column: ApiRosterColumnInfo) => {
    return permissions[column.name]
      && (!column.pii || selectedRole.canViewPII || selectedRole.canViewPHI)
      && (!column.phi || selectedRole.canViewPHI);
  };

  const buildRosterColumnRows = () => {
    return rosterColumns
      .filter(column => column.name !== 'lastReported')
      .map(column => (
        <TableRow key={column.name}>
          <TableCell className={classes.rolePermissionCell}>
            {column.displayName}
          </TableCell>
          <TableCell className={classes.rolePermissionIconCell}>
            {columnAllowed(column) && <CheckIcon />}
          </TableCell>
        </TableRow>
      ));
  };
  return (
    <Dialog onClose={onCancel} open={Boolean(open)} maxWidth="md" fullWidth>
      <DialogContent>
        <DialogTitle className={classes.dialogTitle}>
          Role Assignment for <b>{`${user?.firstName} ${user?.lastName}`}</b>
        </DialogTitle>
        <Divider />
        <FormControl className={classes.roleSelect}>
          <Typography className={classes.roleHeader}>Role</Typography>
          <Select
            native
            disabled={loading}
            autoFocus
            value={selectedRoleIndex}
            onChange={selectedRoleChanged}
            inputProps={{
              name: 'role',
              id: 'role-select',
            }}
          >
            {availableRoles.map((role, index) => (
              <option key={role.id} value={index}>
                {role.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Description:</Typography>
            <Typography>{selectedRole.description}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Allowed Notifications:</Typography>
            <Table aria-label="Notifications">
              <TableBody>
                {buildNotificationEventRows()}
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={6}>

            <Typography className={classes.roleHeader}>Viewable Roster Columns:</Typography>
            <Table aria-label="Roster Columns">
              <TableBody>
                {buildRosterColumnRows()}
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Permissions:</Typography>
            <Table aria-label="Permissions">
              <TableBody>
                <TableRow>
                  <TableCell className={classes.rolePermissionCell}>Manage Group</TableCell>
                  <TableCell className={classes.rolePermissionIconCell}>
                    {selectedRole!.canManageGroup && <CheckIcon />}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.rolePermissionCell}>Manage Roster</TableCell>
                  <TableCell className={classes.rolePermissionIconCell}>
                    {selectedRole!.canManageRoster && <CheckIcon />}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.rolePermissionCell}>Manage Workspace</TableCell>
                  <TableCell className={classes.rolePermissionIconCell}>
                    {selectedRole!.canManageWorkspace && <CheckIcon />}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.rolePermissionCell}>View Roster</TableCell>
                  <TableCell className={classes.rolePermissionIconCell}>
                    {selectedRole!.canViewRoster && <CheckIcon />}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.rolePermissionCell}>View Muster Reports</TableCell>
                  <TableCell className={classes.rolePermissionIconCell}>
                    {selectedRole!.canViewMuster && <CheckIcon />}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.rolePermissionCell}>View PII</TableCell>
                  <TableCell className={classes.rolePermissionIconCell}>
                    {selectedRole!.canViewPII && <CheckIcon />}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.rolePermissionCell}>View PHI</TableCell>
                  <TableCell className={classes.rolePermissionIconCell}>
                    {selectedRole.canViewPHI && <CheckIcon />}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.roleDialogActions}>
        <Button disabled={loading} variant="outlined" onClick={onCancel} color="primary">
          Cancel
        </Button>
        <ButtonWithSpinner
          onClick={() => onChange(selectedRole)}
          color="primary"
          loading={loading}
        >
          {confirmButtonText}
        </ButtonWithSpinner>
      </DialogActions>
    </Dialog>
  );
};
export default SelectRoleDialog;
