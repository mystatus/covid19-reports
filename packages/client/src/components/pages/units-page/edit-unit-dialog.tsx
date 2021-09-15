import React, {
  useState,
} from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  AddUnitBody,
} from '@covid19-reports/shared';
import useStyles from './edit-unit-dialog.styles';
import {
  ApiUnit,
} from '../../../models/api-response';
import { formatErrorMessage } from '../../../utility/errors';
import { UnitClient } from '../../../client/unit.client';
import { Dialog } from '../../dialog/dialog';

export interface EditUnitDialogProps {
  open: boolean;
  orgId?: number;
  unit?: ApiUnit;
  onClose?: () => void;
  onError?: (error: string) => void;
}

export const EditUnitDialog = (props: EditUnitDialogProps) => {
  const { open, orgId, unit, onClose, onError } = props;
  const classes = useStyles();
  const [formDisabled, setFormDisabled] = useState(false);
  const existingUnit: boolean = !!unit;
  const [name, setName] = useState(unit?.name || '');

  if (!open) {
    return null;
  }

  const onInputChanged = (func: (f: string) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.value);
  };

  const onSave = async () => {
    setFormDisabled(true);
    const body: AddUnitBody = {
      name,
    };
    try {
      if (existingUnit) {
        await UnitClient.updateUnit(orgId!, unit!.id, body);
      } else {
        await UnitClient.addUnit(orgId!, body);
      }
    } catch (error) {
      if (onError) {
        onError(formatErrorMessage(error));
      }
      setFormDisabled(false);
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  const canSave = () => {
    const isValid = !formDisabled && name.length > 0;
    if (!isValid) {
      return false;
    }
    return name !== unit?.name;
  };

  /* eslint-disable no-bitwise */
  return (
    <Dialog className={classes.root} maxWidth="lg" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingUnit ? 'Edit Unit' : 'New Unit'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography className={classes.headerLabel}>Name</Typography>
            <TextField
              className={classes.textField}
              id="unit-name"
              disabled={formDisabled}
              value={name}
              onChange={onInputChanged(setName)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button disabled={formDisabled} variant="outlined" onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button disabled={!canSave()} onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
  /* eslint-enable no-bitwise */
};
