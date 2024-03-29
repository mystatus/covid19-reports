import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { AddRoleBody, ColumnInfo } from '@covid19-reports/shared';
import useStyles from './edit-role-dialog.styles';
import { ApiRole } from '../../../models/api-response';
import {
  RolePermissions,
  parsePermissions,
  permissionsToArray,
} from '../../../utility/permission-set';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { EditableBooleanTable } from '../../tables/editable-boolean-table';
import { NotificationSelector } from '../../../selectors/notification.selector';
import { formatErrorMessage } from '../../../utility/errors';
import { RoleClient } from '../../../client/role.client';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { Dialog } from '../../dialog/dialog';
import { rosterApi } from '../../../api/roster.api';

export interface EditRoleDialogProps {
  open: boolean;
  orgId?: number;
  role?: ApiRole;
  onClose?: () => void;
  onError?: (error: string) => void;
}

export const EditRoleDialog = (props: EditRoleDialogProps) => {
  const { open, orgId, role, onClose, onError } = props;
  const classes = useStyles();

  const notifications = useAppSelector(NotificationSelector.all);
  const { data: rosterColumns } = rosterApi.useGetAllowedColumnsInfoQuery({ orgId: orgId!, includeRelationships: false });

  const [formDisabled, setFormDisabled] = useState(false);

  const existingRole: boolean = !!role;
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [allowedRosterColumns, setAllowedRosterColumns] = useState(parsePermissions(rosterColumns || [], role?.allowedRosterColumns));
  const [allowedNotificationEvents, setAllowedNotificationEvents] = useState(parsePermissions(notifications?.map(notification => {
    return {
      name: notification.id,
      displayName: notification.name,
    };
  }) || [], role?.allowedNotificationEvents));
  const [canManageGroup, setCanManageGroup] = useState(role ? role.canManageGroup : false);
  const [canManageRoster, setCanManageRoster] = useState(role ? role.canManageRoster : false);
  const [canViewObservation, setCanViewObservation] = useState(role ? role.canViewObservation : false);
  const [canViewRoster, setCanViewRoster] = useState(role ? role.canViewRoster : false);
  const [canViewMuster, setCanViewMuster] = useState(role ? role.canViewMuster : false);
  const [canViewPII, setCanViewPII] = useState(role ? role.canViewPII : false);
  const [canViewPHI, setCanViewPHI] = useState(role ? role.canViewPHI : false);
  const [saveRoleLoading, setSaveRoleLoading] = useState(false);

  if (!open) {
    return null;
  }

  const onInputChanged = (func: (f: string) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.value);
  };

  const onPermissionChanged = (func: (f: boolean) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.checked);
  };

  const onRosterColumnChanged = (property: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllowedRosterColumns(previous => {
      const newState = { ...previous };
      newState[property] = event.target.checked;
      return newState;
    });
  };

  const onNotificationEventChanged = (property: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllowedNotificationEvents(previous => {
      const newState = { ...previous };
      newState[property] = event.target.checked;
      return newState;
    });
  };

  const filterAllowedRosterColumns = () => {
    const allowedColumns: RolePermissions = {};
    rosterColumns!.forEach(column => {
      const allowed = columnAllowed(column);
      const previousValue = allowedRosterColumns[column.name];
      allowedColumns[column.name] = previousValue && allowed;
    });
    return allowedColumns;
  };

  const onSave = async () => {
    setSaveRoleLoading(true);
    setFormDisabled(true);
    const allowedColumns = filterAllowedRosterColumns();
    const body: AddRoleBody = {
      name,
      description,
      allowedRosterColumns: permissionsToArray(allowedColumns),
      allowedNotificationEvents: permissionsToArray(allowedNotificationEvents),
      canManageGroup,
      canManageRoster: canManageGroup || canManageRoster,
      canViewObservation: canManageGroup || canViewObservation,
      canViewRoster: canManageGroup || canManageRoster || canViewRoster,
      canViewMuster: canManageGroup || canViewMuster,
      canViewPII: canViewPII || canViewPHI,
      canViewPHI,
    };
    try {
      if (existingRole) {
        await RoleClient.updateRole(orgId!, role!.id, body);
      } else {
        await RoleClient.addRole(orgId!, body);
      }
    } catch (error) {
      if (onError) {
        onError(formatErrorMessage(error));
      }
      setFormDisabled(false);
      return;
    }
    setSaveRoleLoading(false);
    if (onClose) {
      onClose();
    }
  };

  const canSave = () => {
    return !formDisabled && name.length > 0 && description.length > 0;
  };

  const columnAllowed = (column: ColumnInfo) => {
    return (!column.pii || canViewPII || canViewPHI) && (!column.phi || canViewPHI);
  };

  const buildRosterColumnRows = () => {
    return rosterColumns?.map(column => (
      <TableRow key={column.name}>
        <TableCell>
          {column.displayName}
        </TableCell>
        <TableCell>
          <Checkbox
            color="primary"
            disabled={formDisabled || !columnAllowed(column)}
            checked={allowedRosterColumns[column.name] && columnAllowed(column)}
            onChange={onRosterColumnChanged(column.name)}
          />
        </TableCell>
      </TableRow>
    ));
  };

  const buildNotificationEventRows = () => {
    return notifications?.map(notification => (
      <TableRow key={notification.id}>
        <TableCell>
          {notification.name}
        </TableCell>
        <TableCell>
          <Checkbox
            color="primary"
            disabled={formDisabled}
            checked={allowedNotificationEvents[notification.id]}
            onChange={onNotificationEventChanged(notification.id)}
          />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Dialog className={classes.root} maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingRole ? 'Edit Role' : 'New Role'}</DialogTitle>
      <DialogContent>
        <Box display="flex">
          <Box flex={1}>
            <Box className={classes.section}>
              <Typography className={classes.roleHeader}>Role Name:</Typography>
              <TextField
                className={classes.textField}
                id="role-name"
                disabled={formDisabled}
                value={name}
                onChange={onInputChanged(setName)}
              />
            </Box>

            <Box className={classes.section}>
              <Typography className={classes.roleHeader}>Permissions:</Typography>
              <EditableBooleanTable aria-label="Permissions">
                <TableRow>
                  <TableCell>Manage Group</TableCell>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      disabled={formDisabled}
                      checked={canManageGroup}
                      onChange={onPermissionChanged(setCanManageGroup)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Manage Roster</TableCell>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      disabled={formDisabled || canManageGroup}
                      checked={canManageGroup || canManageRoster}
                      onChange={onPermissionChanged(setCanManageRoster)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>View Roster</TableCell>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      disabled={formDisabled || canManageGroup || canManageRoster}
                      checked={canManageGroup || canManageRoster || canViewRoster}
                      onChange={onPermissionChanged(setCanViewRoster)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>View Muster Reports</TableCell>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      disabled={formDisabled || canManageGroup}
                      checked={canManageGroup || canViewMuster}
                      onChange={onPermissionChanged(setCanViewMuster)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>View Observations</TableCell>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      disabled={formDisabled || canManageGroup}
                      checked={canManageGroup || canViewObservation}
                      onChange={onPermissionChanged(setCanViewObservation)}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    View PII
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      disabled={formDisabled || canViewPHI}
                      checked={canViewPII || canViewPHI}
                      onChange={onPermissionChanged(setCanViewPII)}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    View PHI
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      disabled={formDisabled}
                      checked={canViewPHI}
                      onChange={onPermissionChanged(setCanViewPHI)}
                    />
                  </TableCell>
                </TableRow>
              </EditableBooleanTable>
            </Box>
          </Box>

          <Box flex={1}>
            <Box className={classes.section}>
              <Typography className={classes.roleHeader}>Description:</Typography>
              <TextField
                className={classes.textField}
                id="role-description"
                disabled={formDisabled}
                multiline
                rowsMax={2}
                value={description}
                onChange={onInputChanged(setDescription)}
              />
            </Box>

            <Box className={classes.section}>
              <Typography className={classes.roleHeader}>Allowed Notifications:</Typography>
              <EditableBooleanTable aria-label="Notifications">
                {buildNotificationEventRows()}
              </EditableBooleanTable>
            </Box>

            <Box className={classes.section}>
              <Typography className={classes.roleHeader}>
                Viewable Roster Columns:
              </Typography>
              <EditableBooleanTable aria-label="Roster Columns">
                {buildRosterColumnRows()}
              </EditableBooleanTable>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className={classes.roleDialogActions}>
        <Button disabled={formDisabled} variant="outlined" onClick={onClose} color="primary">
          Cancel
        </Button>
        <ButtonWithSpinner
          disabled={!canSave()}
          onClick={onSave}
          color="primary"
          loading={saveRoleLoading}
        >
          Save
        </ButtonWithSpinner>
      </DialogActions>
    </Dialog>
  );
};
