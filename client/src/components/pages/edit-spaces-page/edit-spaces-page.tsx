import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, {
  useEffect,
  useState,
} from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckIcon from '@material-ui/icons/Check';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PageHeader from '../../page-header/page-header';
import useStyles from './edit-spaces-page.styles';
import {
  ApiWorkspace,
  ApiWorkspaceTemplate,
} from '../../../models/api-response';
import {
  EditSpaceDialog,
  EditWorkspaceDialogProps,
} from './edit-space-dialog';
import { ButtonSet } from '../../buttons/button-set';
import { Modal } from '../../../actions/modal.actions';
import { formatErrorMessage } from '../../../utility/errors';
import { UserSelector } from '../../../selectors/user.selector';
import { EditSpacesPageHelp } from './edit-spaces-page-help';
import { WorkspaceClient } from '../../../client/workspace.client';

interface WorkspaceMenuState {
  anchor: HTMLElement | null,
  workspace?: ApiWorkspace,
}

export const EditSpacesPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [workspaces, setWorkspaces] = useState<ApiWorkspace[]>([]);
  const [workspaceTemplates, setWorkspaceTemplates] = useState<ApiWorkspaceTemplate[]>([]);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<null | ApiWorkspace>(null);
  const [editWorkspaceDialogProps, setEditWorkspaceDialogProps] = useState<EditWorkspaceDialogProps>({ open: false });
  const [workspaceMenu, setWorkspaceMenu] = React.useState<WorkspaceMenuState>({ anchor: null });

  const orgId = useSelector(UserSelector.orgId)!;

  const initializeTable = React.useCallback(async () => {
    const ws = await WorkspaceClient.getOrgWorkspaces(orgId);
    const templates = await WorkspaceClient.getOrgWorkspaceTemplates(orgId);
    setWorkspaces(ws);
    setWorkspaceTemplates(templates);
  }, [orgId]);

  const newWorkspace = async () => {
    setEditWorkspaceDialogProps({
      open: true,
      orgId,
      onClose: async () => {
        setEditWorkspaceDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        dispatch(Modal.alert('Add Space', `Unable to add space: ${message}`));
      },
    });
  };

  const editWorkspace = () => {
    if (workspaceMenu.workspace) {
      const workspace = workspaceMenu.workspace;
      setWorkspaceMenu({ anchor: null });
      setEditWorkspaceDialogProps({
        open: true,
        workspace,
        orgId,
        onClose: async () => {
          setEditWorkspaceDialogProps({ open: false });
          await initializeTable();
        },
        onError: (message: string) => {
          dispatch(Modal.alert('Edit Space', `Unable to edit space: ${message}`)).then();
        },
      });
    }
  };

  const deleteWorkspace = () => {
    if (workspaceMenu.workspace) {
      const workspace = workspaceMenu.workspace;
      setWorkspaceMenu({ anchor: null });
      setWorkspaceToDelete(workspace);
    }
  };

  const confirmDeleteWorkspace = async () => {
    if (!workspaceToDelete) {
      return;
    }
    try {
      await WorkspaceClient.deleteWorkspace(orgId, workspaceToDelete.id);
    } catch (error) {
      dispatch(Modal.alert('Delete Space', formatErrorMessage(error, 'Unable to delete space'))).then();
    }
    setWorkspaceToDelete(null);
    await initializeTable();
  };

  const cancelDeleteWorkspaceDialog = () => {
    setWorkspaceToDelete(null);
  };

  const handleWorkspaceMenuClick = (workspace: ApiWorkspace) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setWorkspaceMenu({ anchor: event.currentTarget, workspace });
  };

  const handleWorkspaceMenuClose = () => {
    setWorkspaceMenu({ anchor: null });
  };

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <PageHeader
          title="Edit Spaces"
          help={{
            contentComponent: EditSpacesPageHelp,
            cardId: 'editSpacesPage',
          }}
        />
        <ButtonSet>
          <Button
            size="large"
            variant="text"
            color="primary"
            onClick={newWorkspace}
            startIcon={<AddCircleIcon />}
          >
            Add New Space
          </Button>
        </ButtonSet>
        <TableContainer className={classes.table} component={Paper}>
          <Table aria-label="workspaces table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell className={classes.iconCell}>PII</TableCell>
                <TableCell className={classes.iconCell}>PHI</TableCell>
                <TableCell className={classes.iconCell} />
              </TableRow>
            </TableHead>
            <TableBody>
              {workspaces.map(workspace => (
                <TableRow key={workspace.id}>
                  <TableCell component="th" scope="row">{workspace.name}</TableCell>
                  <TableCell>{workspace.description}</TableCell>
                  <TableCell className={classes.iconCell}>
                    {workspace.pii && (
                      <CheckIcon />
                    )}
                  </TableCell>
                  <TableCell className={classes.iconCell}>
                    {workspace.phi && (
                      <CheckIcon />
                    )}
                  </TableCell>
                  <TableCell className={classes.iconCell}>
                    <IconButton
                      aria-label="workspace actions"
                      aria-controls={`workspace-${workspace.id}-menu`}
                      aria-haspopup="true"
                      onClick={handleWorkspaceMenuClick(workspace)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <Menu
                id="workspace-menu"
                anchorEl={workspaceMenu.anchor}
                keepMounted
                open={Boolean(workspaceMenu.workspace)}
                onClose={handleWorkspaceMenuClose}
              >
                <MenuItem onClick={editWorkspace}>Edit Space</MenuItem>
                <MenuItem onClick={deleteWorkspace}>Delete Space</MenuItem>
              </Menu>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      {Boolean(workspaceToDelete) && (
        <Dialog
          open={Boolean(workspaceToDelete)}
          onClose={cancelDeleteWorkspaceDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Space</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Are you sure you want to delete the '${workspaceToDelete?.name}' space?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteWorkspace}>
              Yes
            </Button>
            <Button onClick={cancelDeleteWorkspaceDialog}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {editWorkspaceDialogProps.open && (
        <EditSpaceDialog
          open={editWorkspaceDialogProps.open}
          orgId={editWorkspaceDialogProps.orgId}
          workspace={editWorkspaceDialogProps.workspace}
          templates={workspaceTemplates}
          onClose={editWorkspaceDialogProps.onClose}
          onError={editWorkspaceDialogProps.onError}
        />
      )}
    </main>
  );
};
