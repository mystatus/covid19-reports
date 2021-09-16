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
import { SavedFilterSerialized } from '@covid19-reports/shared';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { isCustomFilter } from '../../view/view-utils';

export interface SaveNewFilterDialogProps {
  open: boolean;
  filter: SavedFilterSerialized | undefined;
  onSave: (newFilter: SavedFilterSerialized) => Promise<void>;
  onCancel: () => void;
}

export const SaveNewFilterDialog = (props: SaveNewFilterDialogProps) => {
  const { open, filter, onSave, onCancel } = props;

  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async () => {
    if (filter == null) {
      throw new Error('Missing new filter data');
    }

    setIsSaving(true);

    try {
      await onSave({
        ...filter,
        name,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset when the dialog is closed.
  useEffect(() => {
    if (!open) {
      setName('');
    }
  }, [open, setName]);

  const isDuplicating = filter != null && !isCustomFilter(filter.id);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
    >
      <DialogTitle>
        {isDuplicating ? `Duplicate Filter "${filter?.name}"` : 'Save New Filter'}
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
          disabled={name.length === 0}
          loading={isSaving}
          color="primary"
        >
          Save
        </ButtonWithSpinner>
      </DialogActions>
    </Dialog>
  );
};
