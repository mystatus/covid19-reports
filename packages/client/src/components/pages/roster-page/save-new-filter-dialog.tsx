import React, {
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormGroup,
  TextField,
} from '@material-ui/core';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';

export interface SaveNewFilterDialogProps {
  open: boolean;
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
}

export const SaveNewFilterDialog = (props: SaveNewFilterDialogProps) => {
  const { open, onSave, onCancel } = props;

  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async () => {
    setIsSaving(true);

    try {
      await onSave(name);
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = () => (name.length > 0);

  useEffect(() => {
    // Reset when the dialog is closed.
    if (!open) {
      setName('');
    }
  }, [open, setName]);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
    >
      <DialogTitle>
        Save New Filter
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Enter a name for your new saved filter.
        </DialogContentText>

        <FormGroup>
          <TextField
            label="Name"
            onChange={event => setName(event.target.value)}
            value={name}
            required
            autoFocus
          />
        </FormGroup>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="primary"
        >
          Cancel
        </Button>

        <ButtonWithSpinner
          onClick={handleSaveClick}
          disabled={!canSave()}
          loading={isSaving}
          color="primary"
        >
          Save
        </ButtonWithSpinner>
      </DialogActions>
    </Dialog>
  );
};
