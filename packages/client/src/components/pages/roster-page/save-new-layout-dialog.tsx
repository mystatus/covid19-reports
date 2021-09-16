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
import { SavedLayoutSerialized } from '@covid19-reports/shared';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { isDefaultLayout } from '../../view/view-utils';

export interface SaveNewLayoutDialogProps {
  open: boolean;
  layout: SavedLayoutSerialized | undefined;
  onSave: (newLayout: SavedLayoutSerialized) => Promise<void>;
  onCancel: () => void;
}

export const SaveNewLayoutDialog = (props: SaveNewLayoutDialogProps) => {
  const { open, layout, onSave, onCancel } = props;

  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async () => {
    if (layout == null) {
      throw new Error('Missing new layout data');
    }

    setIsSaving(true);

    try {
      await onSave({
        ...layout,
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

  const isDuplicating = layout != null && !isDefaultLayout(layout.id);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
    >
      <DialogTitle>
        {isDuplicating ? `Duplicate Layout "${layout?.name}"` : 'Save New Layout'}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Enter a name for your new saved layout.
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
