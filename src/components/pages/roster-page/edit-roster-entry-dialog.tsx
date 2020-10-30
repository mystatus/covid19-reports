import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TableCell,
  TableRow,
  TextField,
} from '@material-ui/core';
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import MomentUtils from '@date-io/moment';
import axios from 'axios';
import useStyles from './edit-roster-entry-dialog.style';
import { ApiRosterColumnInfo, ApiRosterColumnType, ApiRosterEntry } from '../../../models/api-response';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { EditableBooleanTable } from '../../tables/editable-boolean-table';

export interface EditRosterEntryDialogProps {
  open: boolean,
  orgId?: number,
  rosterColumnInfos?: ApiRosterColumnInfo[],
  rosterEntry?: ApiRosterEntry,
  onClose?: () => void,
  onError?: (error: string) => void,
}

export const EditRosterEntryDialog = (props: EditRosterEntryDialogProps) => {
  const classes = useStyles();
  const [formDisabled, setFormDisabled] = useState(false);
  const {
    open, orgId, rosterColumnInfos, onClose, onError,
  } = props;

  const hiddenEditFields = ['lastReported'];

  const [saveRosterEntryLoading, setSaveRosterEntryLoading] = useState(false);

  const existingRosterEntry: boolean = !!props.rosterEntry;
  const [rosterEntry, setRosterEntryProperties] = useState(existingRosterEntry ? props.rosterEntry as ApiRosterEntry : {} as ApiRosterEntry);

  if (!open) {
    return <></>;
  }

  function updateRosterEntryProperty(property: string, value: any) {
    setRosterEntryProperties({
      ...rosterEntry,
      [property]: value,
    });
  }

  const onTextFieldChanged = (columnName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updateRosterEntryProperty(columnName, event.target.value);
  };

  const onNumberFieldChanged = (columnName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const number = parseFloat(event.target.value);
    updateRosterEntryProperty(columnName, Number.isNaN(number) ? null : number);
  };

  const onCheckboxChanged = (columnName: string) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    updateRosterEntryProperty(columnName, checked);
  };

  const onDateFieldChanged = (columnName: string) => (date: MaterialUiPickersDate) => {
    updateRosterEntryProperty(columnName, date?.toISOString());
  };

  const onSave = async () => {
    setFormDisabled(true);
    try {
      setSaveRosterEntryLoading(true);
      if (existingRosterEntry) {
        await axios.put(`api/roster/${orgId}/${rosterEntry!.id}`, rosterEntry);
      } else {
        await axios.post(`api/roster/${orgId}`, rosterEntry);
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
    } finally {
      setSaveRosterEntryLoading(false);
    }
    if (onClose) {
      onClose();
    }
  };

  const canSave = () => {
    if (formDisabled || !rosterColumnInfos) {
      return false;
    }

    let result = true;

    const requiredColumns = rosterColumnInfos.filter(columnInfo => columnInfo.required);
    if (requiredColumns) {
      for (const column of requiredColumns) {

        if (rosterEntry[column.name] == null) {
          return false;
        }

        switch (column.type) {
          case ApiRosterColumnType.String:
          case ApiRosterColumnType.Date:
          case ApiRosterColumnType.DateTime:
            if ((rosterEntry[column.name] as string).length === 0) {
              result = false;
            }
            break;
          default:
            break;
        }

      }
    }

    return result;
  };


  const buildCheckboxFields = () => {
    const columns = rosterColumnInfos?.filter(columnInfo => {
      return columnInfo.type === 'boolean' && hiddenEditFields.indexOf(columnInfo.name) < 0;
    });
    return columns?.map(columnInfo => (
      <TableRow key={columnInfo.name}>
        <TableCell>
          {columnInfo.displayName}
        </TableCell>
        <TableCell>
          <Checkbox
            color="primary"
            id={columnInfo.name}
            disabled={formDisabled || (existingRosterEntry && !columnInfo.updatable)}
            checked={rosterEntry[columnInfo.name] as boolean || false}
            onChange={onCheckboxChanged(columnInfo.name)}
          />
        </TableCell>
      </TableRow>
    ));
  };

  const buildTextInput = (columnInfo: ApiRosterColumnInfo) => {
    const numberField = columnInfo.type === ApiRosterColumnType.Number;
    return (
      <TextField
        className={classes.textField}
        id={columnInfo.name}
        label={columnInfo.displayName}
        disabled={formDisabled || (existingRosterEntry && !columnInfo.updatable)}
        required={columnInfo.required}
        onChange={numberField ? onNumberFieldChanged(columnInfo.name) : onTextFieldChanged(columnInfo.name)}
        value={rosterEntry[columnInfo.name] || ''}
        type={numberField ? 'number' : 'text'}
      />
    );
  };

  const buildDateInput = (columnInfo: ApiRosterColumnInfo) => {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          className={classes.textField}
          id={columnInfo.name}
          format="MM/DD/YYYY"
          label={columnInfo.displayName}
          disabled={formDisabled || (existingRosterEntry && !columnInfo.updatable)}
          required={columnInfo.required}
          placeholder="mm/dd/yy"
          value={rosterEntry[columnInfo.name] ? rosterEntry[columnInfo.name] as string : null}
          onChange={onDateFieldChanged(columnInfo.name)}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const buildDateTimeInput = (columnInfo: ApiRosterColumnInfo) => {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DateTimePicker
          className={classes.textField}
          id={columnInfo.name}
          format="MM/DD/YYYY hh:mm A"
          label={columnInfo.displayName}
          disabled={formDisabled || (existingRosterEntry && !columnInfo.updatable)}
          required={columnInfo.required}
          placeholder="mm/dd/yy hh:mm:ss"
          value={rosterEntry[columnInfo.name] ? rosterEntry[columnInfo.name] as string : null}
          onChange={onDateFieldChanged(columnInfo.name)}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const buildInputFields = () => {
    const columns = rosterColumnInfos?.filter(columnInfo => {
      return columnInfo.type !== 'boolean' && hiddenEditFields.indexOf(columnInfo.name) < 0;
    });
    return columns?.map(columnInfo => (
      <Grid key={columnInfo.name} item xs={6}>
        {buildInputFieldForColumnType(columnInfo)}
      </Grid>
    ));
  };

  const buildInputFieldForColumnType = (column: ApiRosterColumnInfo) => {
    switch (column.type) {
      case ApiRosterColumnType.String:
      case ApiRosterColumnType.Number:
        return buildTextInput(column);
      case ApiRosterColumnType.DateTime:
        return buildDateTimeInput(column);
      case ApiRosterColumnType.Date:
        return buildDateInput(column);
      default:
        console.warn(`Unhandled column type found while creating input fields: ${column.type}`);
        return '';
    }
  };

  return (
    <Dialog className={classes.root} maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingRosterEntry ? 'Edit Roster Entry' : 'New Roster Entry'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {buildInputFields()}
        </Grid>
        <label className={classes.booleanTableLabel}>Other:</label>
        <EditableBooleanTable aria-label="Other Fields">
          {buildCheckboxFields()}
        </EditableBooleanTable>
      </DialogContent>
      <DialogActions className={classes.editRosterEntryDialogActions}>
        <Button disabled={formDisabled} variant="outlined" onClick={onClose} color="primary">
          Cancel
        </Button>
        <ButtonWithSpinner disabled={!canSave()} onClick={onSave} color="primary" loading={saveRosterEntryLoading}>
          Save
        </ButtonWithSpinner>
      </DialogActions>
    </Dialog>
  );
};
