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
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { PinTargets } from 'shared/src/api/saved-layout.api.types';

export interface SaveNewLayoutDialogProps {
  open: boolean;
  onSave: (name: string, pinTarget: PinTargets) => Promise<void>;
  onCancel: () => void;
}

export const SaveNewLayoutDialog = (props: SaveNewLayoutDialogProps) => {
  const { open, onSave, onCancel } = props;

  const [name, setName] = useState('');
  const [pinTarget, setPinTarget] = useState<PinTargets>(PinTargets.None);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async () => {
    setIsSaving(true);

    try {
      await onSave(name, pinTarget);
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = () => (name.length > 0);

  useEffect(() => {
    // Reset when the dialog is closed.
    if (!open) {
      setName('');
      setPinTarget(PinTargets.None);
    }
  }, [open, setName, setPinTarget]);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
    >
      <DialogTitle>
        Save New Layout
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
          <InputLabel id="pinSelectLabel">Pin To</InputLabel>
          <Select
            labelId="pinSelectLabel"
            value={pinTarget}
            displayEmpty
            onChange={event => setPinTarget(event.target.value as PinTargets)}
          >
            {
              Object.values(PinTargets).map(value => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))
            }
          </Select>
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
