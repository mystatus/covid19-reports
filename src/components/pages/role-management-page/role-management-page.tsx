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
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import PageHeader from '../../page-header/page-header';
import useStyles from './role-management-page.styles';
import { EditRoleDialog, EditRoleDialogProps } from './edit-role-dialog';
import { AppFrame } from '../../../actions/app-frame.actions';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import RoleInfoPanel from '../../role-info-panel/role-info-panel';
import { UserSelector } from '../../../selectors/user.selector';
import { RoleSelector } from '../../../selectors/role.selector';
import { Role } from '../../../actions/role.actions';
import { Workspace } from '../../../actions/workspace.actions';
import { ButtonSet } from '../../buttons/button-set';
import { Modal } from '../../../actions/modal.actions';
import { formatMessage } from '../../../utility/errors';


export const RoleManagementPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(-1);
  const [deleteRoleDialogOpen, setDeleteRoleDialogOpen] = useState(false);
  const [editRoleDialogProps, setEditRoleDialogProps] = useState<EditRoleDialogProps>({ open: false });
  const [deleteRoleLoading, setDeleteRoleLoading] = useState(false);
  const roles = useSelector(RoleSelector.all);
  const orgId = useSelector(UserSelector.orgId);

  const initializeTable = React.useCallback(async () => {
    if (orgId) {
      dispatch(AppFrame.setPageLoading(true));
      await dispatch(Role.fetch(orgId));
      await dispatch(Workspace.fetch(orgId));
      dispatch(AppFrame.setPageLoading(false));
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
      await axios.delete(`api/role/${orgId}/${roles[selectedRoleIndex].id}`);
    } catch (error) {
      dispatch(Modal.alert('Delete Role', formatMessage(error, 'Unable to delete role')));
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
        <PageHeader title="Group Roles" />
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
          <Typography>Default Unit Filter</Typography>
          <Typography>Analytics Workspace</Typography>
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
              <Typography className={classes.indexPrefixColumn}>{row.defaultIndexPrefix}</Typography>
              <Typography>{row.workspace ? row.workspace.name : 'None'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <RoleInfoPanel role={row} hideUnitFilter hideWorkspaceName />
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
