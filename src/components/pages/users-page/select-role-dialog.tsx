import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl, Grid,
  Select,
  Typography,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import {
  ApiRole, ApiUnit, ApiUser,
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
  units: ApiUnit[]
  onCancel?: () => void
  onChange: (selectedRole: ApiRole, unitFilter: string) => void
  open?: boolean
  user: ApiUser
};

const SelectRoleDialog: React.FunctionComponent<SelectRoleDialogProps> = (props: SelectRoleDialogProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orgId = useSelector(UserSelector.orgId);
  const availableRoles = useSelector(RoleSelector.all);
  const [selectedUnit, setSelectedUnit] = useState('*');
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(-1);
  const {
    confirmButtonText, loading, onCancel, onChange, open, user,
  } = props;

  useEffect(() => {
    if (availableRoles!.length > 0) {
      const userRole = user?.userRoles?.[0];
      const roleIndex = userRole ? availableRoles.findIndex(role => role.id === userRole.role.id) : 0;
      setSelectedRoleIndex(roleIndex >= 0 ? roleIndex : 0);
      setSelectedUnit(userRole?.indexPrefix || '*');
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

  function selectedUnitChanged(event: React.ChangeEvent<{ value: unknown }>) {
    setSelectedUnit(event.target.value as string);
  }

  function selectedRoleChanged(event: React.ChangeEvent<{ value: unknown }>) {
    setSelectedRoleIndex(event.target.value as number);
  }

  if (availableRoles.length <= selectedRoleIndex || selectedRoleIndex < 0) {
    return null;
  }

  function canSave() {
    const originalRole = user?.userRoles?.[0];
    if (!originalRole) {
      return true;
    }
    return originalRole.indexPrefix !== selectedUnit || originalRole.role.id !== availableRoles[selectedRoleIndex].id;
  }

  const selectedRole = availableRoles[selectedRoleIndex];

  return (
    <Dialog onClose={onCancel} open={Boolean(open)} maxWidth="md" fullWidth>
      <DialogTitle>
        Role and Unit Assignment for <b>{`${user?.firstName} ${user?.lastName}`}</b>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl className={classes.roleSelect}>
              <Typography className={classes.roleHeader}>Role:</Typography>
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
          </Grid>
          <Grid item xs={6}>
            <FormControl className={classes.roleSelect}>
              <Typography className={classes.roleHeader}>Unit:</Typography>
              <Select
                native
                disabled={loading}
                autoFocus
                value={selectedUnit}
                onChange={selectedUnitChanged}
                inputProps={{
                  name: 'unit',
                  id: 'unit-select',
                }}
              >
                <option key="all" value="*">All Units</option>
                {props.units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <RoleInfoPanel role={selectedRole} scrollFix />
      </DialogContent>
      <DialogActions className={classes.roleDialogActions}>
        <Button disabled={loading} variant="outlined" onClick={onCancel} color="primary">
          Cancel
        </Button>
        <ButtonWithSpinner
          onClick={() => onChange(selectedRole, selectedUnit)}
          disabled={!canSave()}
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
