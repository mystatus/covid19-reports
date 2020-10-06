import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid, Select, TextField, Typography,
} from '@material-ui/core';
import axios from 'axios';
import useStyles from './edit-workspace-dialog.styles';
import { ApiWorkspace, ApiWorkspaceTemplate } from '../../../models/api-response';

export interface EditWorkspaceDialogProps {
  open: boolean,
  orgId?: number,
  workspace?: ApiWorkspace,
  templates?: ApiWorkspaceTemplate[],
  onClose?: () => void,
  onError?: (error: string) => void,
}

export const EditWorkspaceDialog = (props: EditWorkspaceDialogProps) => {
  const classes = useStyles();
  const [formDisabled, setFormDisabled] = useState(false);
  const {
    open, orgId, workspace, templates, onClose, onError,
  } = props;

  const existingWorkspace: boolean = !!workspace;
  const [name, setName] = useState(workspace?.name || '');
  const [description, setDescription] = useState(workspace?.description || '');
  const [workspaceTemplate, setWorkspaceTemplate] = useState(workspace?.workspaceTemplate?.id || -1);

  if (!open) {
    return <></>;
  }

  const onInputChanged = (func: (f: string) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.value);
  };

  const onWorkspaceTemplateChanged = (event: React.ChangeEvent<{ value: unknown }>) => {
    setWorkspaceTemplate(event.target.value as number);
  };

  const onSave = async () => {
    setFormDisabled(true);
    const body = {
      name,
      description,
      workspaceTemplate,
    };
    try {
      if (existingWorkspace) {
        await axios.put(`api/workspace/${orgId}/${workspace!.id}`, body);
      } else {
        await axios.post(`api/workspace/${orgId}`, body);
      }
    } catch (error) {
      if (onError) {
        let message = 'Internal Server Error';
        if (error.response?.data?.errors && error.response.data.errors.length > 0) {
          message = error.response.data.errors[0].message;
        }
        onError(message);
      }
      setFormDisabled(false);
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  const canSave = () => {
    return !formDisabled && name.length > 0 && description.length > 0;
  };

  return (
    <Dialog maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingWorkspace ? 'Edit Workspace' : 'New Workspace'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Workspace Name:</Typography>
            <TextField
              className={classes.textField}
              id="workspace-name"
              disabled={formDisabled}
              value={name}
              onChange={onInputChanged(setName)}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Workspace Template:</Typography>
            <Select
              native
              disabled={formDisabled || existingWorkspace}
              autoFocus
              value={workspaceTemplate}
              onChange={onWorkspaceTemplateChanged}
              inputProps={{
                name: 'template',
                id: 'template-select',
              }}
            >
              <option key={-1} value={-1}>None</option>
              {templates && templates.map((role, index) => (
                <option key={role.id} value={index}>{role.name}</option>
              ))}
            </Select>
            <TextField
              className={classes.textField}
              id="workspace-template"
              disabled={existingWorkspace}
              value={workspace?.workspaceTemplate?.id || 'None'}
              onChange={onWorkspaceTemplateChanged}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.roleHeader}>Description:</Typography>
            <TextField
              className={classes.textField}
              id="workspace-description"
              disabled={formDisabled}
              multiline
              rowsMax={2}
              value={description}
              onChange={onInputChanged(setDescription)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.roleDialogActions}>
        <Button disabled={formDisabled} variant="outlined" onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button disabled={!canSave()} onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
