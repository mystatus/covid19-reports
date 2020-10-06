import {
  Button,
  Container, Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import useStyles from './workspaces-page.styles';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import { ApiWorkspace, ApiWorkspaceTemplate } from '../../../models/api-response';
import { EditWorkspaceDialog, EditWorkspaceDialogProps } from './edit-workspace-dialog';
import { AlertDialog, AlertDialogProps } from '../../alert-dialog/alert-dialog';

export const WorkspacesPage = () => {
  const classes = useStyles();
  const [workspaces, setWorkspaces] = useState<ApiWorkspace[]>([]);
  const [workspaceTemplates, setWorkspaceTemplates] = useState<ApiWorkspaceTemplate[]>([]);
  const [alertDialogProps, setAlertDialogProps] = useState<AlertDialogProps>({ open: false });
  const [editWorkspaceDialogProps, setEditWorkspaceDialogProps] = useState<EditWorkspaceDialogProps>({ open: false });

  const orgId = useSelector<AppState, UserState>(state => state.user).activeRole?.org?.id;

  const initializeTable = React.useCallback(async () => {
    const ws = (await axios.get(`api/workspace/${orgId}`)).data as ApiWorkspace[];
    const templates = (await axios.get(`api/workspace/${orgId}/templates`)).data as ApiWorkspaceTemplate[];
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
        setAlertDialogProps({
          open: true,
          title: 'Add Role',
          message: `Unable to add role: ${message}`,
          onClose: () => { setAlertDialogProps({ open: false }); },
        });
      },
    });
  };

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <Grid container>
          <Grid item xs={6}>
            <h1>Workspaces</h1>
          </Grid>
          <Grid className={classes.newWorkspace} item xs={6}>
            <Button
              color="primary"
              onClick={newWorkspace}
              startIcon={<AddCircleOutlineIcon />}
            >
              New Workspace
            </Button>
          </Grid>
        </Grid>
        <TableContainer className={classes.table} component={Paper}>
          <Table aria-label="workspaces table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>PII</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {workspaces.map(workspace => (
                <TableRow key={workspace.id}>
                  <TableCell component="th" scope="row">{workspace.name}</TableCell>
                  <TableCell>{workspace.description}</TableCell>
                  <TableCell>{workspace.pii}</TableCell>
                  <TableCell>edit</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      {editWorkspaceDialogProps.open && (
        <EditWorkspaceDialog
          open={editWorkspaceDialogProps.open}
          orgId={editWorkspaceDialogProps.orgId}
          workspace={editWorkspaceDialogProps.workspace}
          templates={workspaceTemplates}
          onClose={editWorkspaceDialogProps.onClose}
          onError={editWorkspaceDialogProps.onError}
        />
      )}
      {alertDialogProps.open && (
        <AlertDialog open={alertDialogProps.open} title={alertDialogProps.title} message={alertDialogProps.message} onClose={alertDialogProps.onClose} />
      )}
    </main>
  );
};
