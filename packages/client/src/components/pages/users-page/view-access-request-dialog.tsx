import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  FormGroup,
  FormHelperText,
  Grid,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Alert } from '@material-ui/lab';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Role } from '../../../actions/role.actions';
import { Unit } from '../../../actions/unit.actions';
import {
  ApiAccessRequest,
  ApiUnit,
} from '../../../models/api-response';
import { RoleSelector } from '../../../selectors/role.selector';
import { UnitSelector } from '../../../selectors/unit.selector';
import { UserSelector } from '../../../selectors/user.selector';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import RoleInfoPanel from '../../role-info-panel/role-info-panel';
import useStyles from './view-access-request-dialog.styles';
import { AccessRequestClient } from '../../../client/access-request.client';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { Dialog } from '../../dialog/dialog';

export type ViewAccessRequestDialogProps = DialogProps & {
  onClose: () => void;
  onComplete: () => void;
  accessRequest: ApiAccessRequest;
};

export const ViewAccessRequestDialog = (props: ViewAccessRequestDialogProps) => {
  const { open, onClose, onComplete, accessRequest } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [approveLoading, setApproveLoading] = useState(false);
  const [denyLoading, setDenyLoading] = useState(false);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(-1);
  const [selectedUnitIds, setSelectedUnitIds] = useState([] as number[]);
  const [errorMessage, setErrorMessage] = useState(undefined as string | undefined);
  const [showError, setShowError] = useState(false);

  const orgId = useAppSelector(UserSelector.orgId)!;
  const roles = useAppSelector(RoleSelector.all);
  const units = useAppSelector(UnitSelector.all);

  const fullName = `${accessRequest.user.firstName} ${accessRequest.user.lastName}`;
  const actionLoading = approveLoading || denyLoading;
  const approveDisabled = actionLoading || selectedRoleIndex === -1 || selectedUnitIds.length === 0;

  const initializeTable = useCallback(() => {
    void dispatch(Role.fetch(orgId));
    void dispatch(Unit.fetch(orgId));
  }, [dispatch, orgId]);

  useEffect(() => { initializeTable(); }, [initializeTable]);

  const reset = () => {
    setApproveLoading(false);
    setDenyLoading(false);
    setSelectedRoleIndex(-1);
    setSelectedUnitIds([]);
  };

  const handleCancelClick = () => {
    onClose();
  };

  const handleDenyClick = async () => {
    setDenyLoading(true);

    try {
      await AccessRequestClient.denyAccessRequest(orgId, {
        requestId: accessRequest.id,
      });

      onComplete();
      onClose();
    } catch (err) {
      handleError(err);
    } finally {
      setDenyLoading(false);
    }
  };

  const handleApproveClick = async () => {
    setApproveLoading(true);

    try {
      await AccessRequestClient.approveAccessRequest(orgId, {
        requestId: accessRequest.id,
        roleId: roles[selectedRoleIndex].id,
        unitIds: selectedUnitIds,
        allUnits: allUnitsSelected(),
      });

      onComplete();
      onClose();
    } catch (err) {
      handleError(err);
    } finally {
      setApproveLoading(false);
    }
  };

  const handleError = (err: any) => {
    let message: string;
    if (err.data) {
      message = err.data.errors.map((x: any) => x.message).join('\n');
    } else {
      message = err.message;
    }

    setErrorMessage(message);
    setShowError(true);
  };

  const handleSelectedRoleChange = (event: ChangeEvent<{ value: unknown }>) => {
    setSelectedRoleIndex(event.target.value as number);
  };

  const selectedRoleRenderValue = () => {
    if (selectedRoleIndex < 0) {
      return <em>- Select Role -</em>;
    }

    return roles[selectedRoleIndex].name;
  };

  const handleSelectedUnitsChange = (event: ChangeEvent<{ value: unknown }>) => {
    const selectedValues = event.target.value as number[];
    if (selectedValues.some(value => value === -1) || selectedValues.length === units.length) {
      setSelectedUnitIds([-1]); // All Units
    } else {
      setSelectedUnitIds(selectedValues);
    }
  };

  const selectedUnitsRenderValue = () => {
    if (selectedUnitIds.length === 0) {
      return <em>- Select Unit(s) -</em>;
    }

    if (selectedUnitIds.length === 1 && selectedUnitIds[0] === -1) {
      return 'All Units';
    }

    return units
      .filter(unitSelected)
      .map(unit => unit.name)
      .join(', ');
  };

  const unitSelected = (unit: ApiUnit) => {
    return selectedUnitIds.indexOf(unit.id) > -1;
  };

  const allUnitsSelected = () => {
    return selectedUnitIds.length === 1 && selectedUnitIds[0] === -1;
  };

  return (
    <>
      <Dialog
        className={classes.root}
        maxWidth="lg"
        open={open}
        onExited={reset}
      >
        <DialogTitle className={classes.dialogTitle}>
          User access request for <span className={classes.dialogTitleUserName}>{fullName}</span>:
        </DialogTitle>

        <DialogContent className={classes.dialogContent}>
          {/* What You Do / Justification */}
          <Box className={classes.section} marginBottom={3}>
            <ol>
              <li>
                <Typography>{fullName} indicated that:</Typography>
                {accessRequest.whatYouDo.map((text, index) => (
                  <Typography className={classes.whatYouDoItem} key={index}>
                    - {text}
                  </Typography>
                ))}
              </li>

              <li>
                <Typography>Justification:</Typography>
                <Typography className={classes.whatYouDoItem}>- {accessRequest.justification}</Typography>
              </li>
            </ol>
          </Box>

          {/* Role / Units */}
          <FormGroup>
            <Grid className={classes.section} container>
              <Grid item xs={7}>
                <FormControl fullWidth>
                  <Typography className={classes.header}>Role:</Typography>
                  <Select
                    disabled={actionLoading}
                    value={selectedRoleIndex}
                    onChange={handleSelectedRoleChange}
                    renderValue={selectedRoleRenderValue}
                  >
                    {roles.map((role, index) => (
                      <MenuItem key={role.id} value={index}>
                        <ListItemText primary={role.name} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Role can be changed at any point after approval.
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid className={classes.rolePermissionsContainer} item xs={5}>
                <Tooltip
                  classes={{
                    tooltip: classes.rolePermissionsTooltip,
                  }}
                  title={<RoleInfoPanel role={roles[selectedRoleIndex]} scrollFix />}
                  placement="bottom"
                  disableHoverListener={selectedRoleIndex === -1}
                  arrow={false}
                  interactive
                >
                  <span>
                    <Button
                      className={classes.rolePermissions}
                      variant="text"
                      startIcon={<VisibilityIcon />}
                      disabled={selectedRoleIndex === -1}
                      disableRipple
                    >
                      Role Permissions
                    </Button>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>

            <Grid className={classes.section} container>
              <Grid item xs={7}>
                <FormControl fullWidth>
                  <Typography className={classes.header}>Units:</Typography>
                  <Select
                    disabled={actionLoading}
                    value={selectedUnitIds}
                    onChange={handleSelectedUnitsChange}
                    renderValue={selectedUnitsRenderValue}
                    multiple
                    displayEmpty
                    MenuProps={{
                      variant: 'menu',
                    }}
                  >
                    <MenuItem key="all" value={-1}>
                      <Checkbox color="primary" checked={allUnitsSelected()} />
                      <ListItemText primary="All Units" />
                    </MenuItem>

                    {units.map(unit => (
                      <MenuItem key={unit.id} value={unit.id} disabled={allUnitsSelected()}>
                        <Checkbox
                          color="primary"
                          checked={allUnitsSelected() || unitSelected(unit)}
                        />
                        <ListItemText primary={unit.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </FormGroup>

          {/* Additional Information */}
          <Box className={classes.section}>
            <Typography className={classes.header}>Additional Information:</Typography>
            <Grid className={classes.additionalInfo} container>
              <Grid className={classes.additionalInfoLeft} item xs={3}>
                <Typography>Name:</Typography>
                <Typography>Email:</Typography>
                <Typography>Phone:</Typography>
                <Typography>Sponsor Name:</Typography>
                <Typography>Sponsor Email:</Typography>
                <Typography>Sponsor Phone:</Typography>
              </Grid>

              <Grid item xs={9}>
                <Typography>{fullName}</Typography>
                <Typography>{accessRequest.user.email}</Typography>
                <Typography>{accessRequest.user.phone}</Typography>
                <Typography>{accessRequest.sponsorName}</Typography>
                <Typography>{accessRequest.sponsorEmail}</Typography>
                <Typography>{accessRequest.sponsorPhone}</Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCancelClick}
          >
            Cancel
          </Button>

          <Box flex={1} />

          <ButtonWithSpinner
            className={classes.denyButton}
            onClick={handleDenyClick}
            disabled={actionLoading}
            loading={denyLoading}
          >
            Deny
          </ButtonWithSpinner>

          <ButtonWithSpinner
            color="primary"
            onClick={handleApproveClick}
            disabled={approveDisabled}
            loading={approveLoading}
          >
            Approve
          </ButtonWithSpinner>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showError}
        onClose={() => setShowError(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
