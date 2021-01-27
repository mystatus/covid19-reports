import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Select,
  Typography,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import {
  ApiRole, ApiUser,
} from '../../../models/api-response';
import useStyles from './select-role-dialog.styles';
import { Notification } from '../../../actions/notification.actions';
import { Role } from '../../../actions/role.actions';
import { RoleSelector } from '../../../selectors/role.selector';
import { UserSelector } from '../../../selectors/user.selector';
import { Roster } from '../../../actions/roster.actions';
import RoleInfoPanel from '../../role-info-panel/role-info-panel';

export type SelectRoleDialogProps = {
  confirmButtonText: string
  loading: boolean
  onCancel?: () => void
  onChange: (selectedRole: ApiRole) => void
  open?: boolean
  user: ApiUser
};

const SelectRoleDialog: React.FunctionComponent<SelectRoleDialogProps> = (props: SelectRoleDialogProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orgId = useSelector(UserSelector.orgId);
  const availableRoles = useSelector(RoleSelector.all);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(-1);
  const {
    confirmButtonText, loading, onCancel, onChange, open, user,
  } = props;

  useEffect(() => {
    if (availableRoles!.length > 0) {
      const roleId = user?.userRoles?.length ? user?.userRoles[0].role.id : availableRoles[0].id;
      const roleIndex = availableRoles.findIndex(role => role.id === roleId);
      setSelectedRoleIndex(roleIndex >= 0 ? roleIndex : 0);
    }
  }, [user, availableRoles]);

  const initializeTable = React.useCallback(async () => {
    if (orgId) {
      dispatch(Notification.fetch(orgId));
      dispatch(Roster.fetchColumns(orgId));
      dispatch(Role.fetch(orgId));
    }
  }, [dispatch, orgId]);

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  function selectedRoleChanged(event: React.ChangeEvent<{ value: unknown }>) {
    setSelectedRoleIndex(event.target.value as number);
  }

  if (availableRoles.length <= selectedRoleIndex || selectedRoleIndex < 0) {
    return null;
  }

  const selectedRole = availableRoles[selectedRoleIndex];

  return (
    <Dialog onClose={onCancel} open={Boolean(open)} maxWidth="md" fullWidth>
      <DialogTitle>
        Role Assignment for <b>{`${user?.firstName} ${user?.lastName}`}</b>
      </DialogTitle>
      <DialogContent>
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
        <RoleInfoPanel role={selectedRole} scrollFix />
      </DialogContent>
      <DialogActions className={classes.roleDialogActions}>
        <Button disabled={loading} variant="outlined" onClick={onCancel} color="primary">
          Cancel
        </Button>
        <ButtonWithSpinner
          onClick={() => onChange(selectedRole)}
          disabled={(user?.userRoles ?? []).some(userRole => userRole.role.id === selectedRole.id)}
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
