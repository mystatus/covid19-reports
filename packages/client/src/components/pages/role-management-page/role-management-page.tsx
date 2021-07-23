import {
  Button,
  Container,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText, Accordion, AccordionSummary, AccordionDetails, Typography, AccordionActions,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import React, { useEffect, useState } from 'react';
import PageHeader from '../../page-header/page-header';
import { RoleManagementPageHelp } from './role-management-page-help';
import useStyles from './role-management-page.styles';
import { EditRoleDialog, EditRoleDialogProps } from './edit-role-dialog';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import RoleInfoPanel from '../../role-info-panel/role-info-panel';
import { UserSelector } from '../../../selectors/user.selector';
import { RoleSelector } from '../../../selectors/role.selector';
import { Role } from '../../../actions/role.actions';
import { Workspace } from '../../../actions/workspace.actions';
import { ButtonSet } from '../../buttons/button-set';
import { Modal } from '../../../actions/modal.actions';
import { formatErrorMessage } from '../../../utility/errors';
import { RoleClient } from '../../../client/role.client';
import { AppFrameActions } from '../../../slices/app-frame.slice';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';

export const RoleManagementPage = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(-1);
  const [deleteRoleDialogOpen, setDeleteRoleDialogOpen] = useState(false);
  const [editRoleDialogProps, setEditRoleDialogProps] = useState<EditRoleDialogProps>({ open: false });
  const [deleteRoleLoading, setDeleteRoleLoading] = useState(false);
  const roles = useAppSelector(RoleSelector.all);
  const orgId = useAppSelector(UserSelector.orgId);

  const initializeTable = React.useCallback(async () => {
    if (orgId) {
      dispatch(AppFrameActions.setPageLoading({ isLoading: true }));
      await dispatch(Role.fetch(orgId));
      await dispatch(Workspace.fetch(orgId));
      dispatch(AppFrameActions.setPageLoading({ isLoading: false }));
    }
  }, [orgId, dispatch]);

  const cancelDeleteRoleDialog = () => {
    setDeleteRoleDialogOpen(false);
  };

  const newRole = async () => {
    setEditRoleDialogProps({
      open: true,
      orgId,
      onClose: async () => {
        setEditRoleDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        dispatch(Modal.alert('Add Role', `Unable to add role: ${message}`));
      },
    });
  };

  const editRole = async () => {
    const selectedRole = roles[selectedRoleIndex];
    setEditRoleDialogProps({
      open: true,
      orgId,
      role: selectedRole,
      onClose: async () => {
        setEditRoleDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        dispatch(Modal.alert('Edit Role', `Unable to edit role: ${message}`));
      },
    });
  };

  const deleteRole = async () => {
    setDeleteRoleLoading(true);
    try {
      await RoleClient.deleteRole(orgId!, roles[selectedRoleIndex].id);
    } catch (error) {
      dispatch(Modal.alert('Delete Role', formatErrorMessage(error, 'Unable to delete role'))).then();
    }
    setDeleteRoleLoading(false);
    setDeleteRoleDialogOpen(false);
    await initializeTable();
  };

  const handleRoleChange = (index: number) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setSelectedRoleIndex(isExpanded ? index : -1);
  };

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <PageHeader
          title="Group Roles"
          help={{
            contentComponent: RoleManagementPageHelp,
            cardId: 'roleManagementPage',
          }}
        />
        <ButtonSet>
          <Button
            size="large"
            variant="text"
            color="primary"
            onClick={newRole}
            startIcon={<AddCircleIcon />}
          >
            Add New Role
          </Button>
        </ButtonSet>
        <div className={classes.accordionHeader}>
          <Typography>Role Name</Typography>
          <Typography>Description</Typography>
        </div>
        {roles.map((row, index) => (
          <Accordion
            key={row.id}
            className={classes.roleAccordion}
            expanded={selectedRoleIndex === index}
            onChange={handleRoleChange(index)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id={`role${row.id}_header`}
            >
              <Typography className={classes.nameColumn}>{row.name}</Typography>
              <Typography className={classes.descriptionColumn}>{row.description}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <RoleInfoPanel role={row} />
            </AccordionDetails>
            <AccordionActions className={classes.roleButtons}>
              <Button
                color="primary"
                onClick={editRole}
              >
                Edit Role
              </Button>
              <Button
                className={classes.deleteRoleButton}
                onClick={() => setDeleteRoleDialogOpen(true)}
                variant="outlined"
              >
                Delete Role
              </Button>
            </AccordionActions>
          </Accordion>
        ))}
      </Container>
      {deleteRoleDialogOpen && (
        <Dialog
          open={deleteRoleDialogOpen}
          onClose={cancelDeleteRoleDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Role</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Are you sure you want to delete the '${roles[selectedRoleIndex].name}' role?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <ButtonWithSpinner
              onClick={deleteRole}
              loading={deleteRoleLoading}
            >
              Yes
            </ButtonWithSpinner>
            <Button onClick={cancelDeleteRoleDialog}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {editRoleDialogProps.open && <EditRoleDialog {...editRoleDialogProps} />}
    </main>
  );
};
