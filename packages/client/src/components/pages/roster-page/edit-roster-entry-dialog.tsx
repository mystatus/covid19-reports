import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TableCell,
  TableRow,
  TextField,
} from '@material-ui/core';
import {
  DatePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import MomentUtils from '@date-io/moment';
import {
  CustomColumnConfigString,
  ColumnInfo,
  ColumnType,
  CustomColumnConfigEnum,
  ColumnValue,
} from '@covid19-reports/shared';
import useStyles from './edit-roster-entry-dialog.style';
import {
  ApiOrphanedRecord,
  ApiRosterEntry,
} from '../../../models/api-response';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { EditableBooleanTable } from '../../tables/editable-boolean-table';
import { UnitSelector } from '../../../selectors/unit.selector';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { Dialog } from '../../dialog/dialog';
import { entityApi } from '../../../api/entity.api';
import { useEffectError } from '../../../hooks/use-effect-error';

export interface EditRosterEntryDialogProps {
  open: boolean;
  orgId?: number;
  rosterColumnInfos: ColumnInfo[];
  rosterEntry?: ApiRosterEntry;
  prepopulated?: Partial<ApiRosterEntry>;
  orphanedRecord?: Partial<ApiOrphanedRecord>;
  onSave?: (rosterEntry: ApiRosterEntry) => void;
  onClose?: () => void;
}

export const EditRosterEntryDialog = (props: EditRosterEntryDialogProps) => {
  const classes = useStyles();
  const units = useAppSelector(UnitSelector.all);
  const {
    open, orgId, prepopulated, orphanedRecord, rosterColumnInfos, onClose,
  } = props;

  const hiddenEditFields = ['unit'];
  const existingRosterEntry: boolean = !!props.rosterEntry;

  const getInitialRosterEntry = useCallback(() => {
    const rosterEntryData = existingRosterEntry ? props.rosterEntry : prepopulated;
    return { ...rosterEntryData } as ApiRosterEntry;
  }, [existingRosterEntry, prepopulated, props.rosterEntry]);

  const [formDisabled, setFormDisabled] = useState(false);
  const [saveRosterEntryLoading, setSaveRosterEntryLoading] = useState(false);
  const [unitChangedPromptOpen, setUnitChangedPromptOpen] = useState(false);
  const [rosterEntry, setRosterEntry] = useState(getInitialRosterEntry);
  const originalUnit = props.rosterEntry?.unit ?? prepopulated?.unit;

  const columnInfos = useMemo(() => {
    // Filter out any join/aggregate columns, since we shouldn't be able to edit those.
    return rosterColumnInfos.filter(column => column.table == null);
  }, [rosterColumnInfos]);

  const [addEntity, {
    error: addEntityError,
  }] = entityApi.roster.useAddEntityMutation();

  const [patchEntity, {
    error: patchEntityError,
  }] = entityApi.roster.usePatchEntityMutation();

  useEffectError(addEntityError, 'Add Entity', 'Failed to add entity');
  useEffectError(patchEntityError, 'Patch Entity', 'Failed to patch entity');

  // Make sure we reset state on open, in case the dialog has stayed mounted.
  useEffect(() => {
    setFormDisabled(false);
    setSaveRosterEntryLoading(false);
    setUnitChangedPromptOpen(false);
    setRosterEntry(getInitialRosterEntry());
  }, [getInitialRosterEntry, open]);

  function updateRosterEntryProperty(property: string, value: ColumnValue) {
    setRosterEntry({
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
    updateRosterEntryProperty(columnName, date?.toISOString() ?? null);
  };

  const onUnitChanged = (event: React.ChangeEvent<{ value: unknown }>) => {
    updateRosterEntryProperty('unit', parseInt(event.target.value as string));
  };

  const getUnitName = (unitId: number) => {
    for (const unit of units) {
      if (unit.id === unitId) {
        return unit.name;
      }
    }
    return 'Unknown';
  };

  const checkSave = async () => {
    if (existingRosterEntry && rosterEntry.unit !== originalUnit) {
      setUnitChangedPromptOpen(true);
    } else {
      await onSave();
    }
  };

  const onSave = async () => {
    setFormDisabled(true);
    setSaveRosterEntryLoading(true);

    const data = {
      ...rosterEntry,
    };

    if (!data.unit) {
      data.unit = units[0].id;
    }

    try {
      if (props.onSave) {
        await props.onSave(data);
      } else if (existingRosterEntry) {
        await patchEntity({
          orgId: orgId!,
          entityId: rosterEntry.id,
          body: data,
        });
      } else {
        await addEntity({
          orgId: orgId!,
          body: data,
        });
      }
    } finally {
      setFormDisabled(false);
      setSaveRosterEntryLoading(false);
    }

    if (onClose) {
      onClose();
    }
  };

  const cancelUnitChangedDialog = () => {
    setUnitChangedPromptOpen(false);
  };

  const canSave = () => {
    if (formDisabled || !columnInfos) {
      return false;
    }

    const requiredColumns = columnInfos.filter(columnInfo => columnInfo.required);
    if (requiredColumns) {
      for (const column of requiredColumns) {
        const value = rosterEntry[column.name] as string;
        if (value == null) {
          return false;
        }

        switch (column.type) {
          case ColumnType.String:
          case ColumnType.Date:
          case ColumnType.DateTime:
            if (value.trim().length === 0) {
              return false;
            }
            if (column.name === 'edipi' && !/^[0-9]{10}$/g.test(value)) {
              return false;
            }
            break;
          default:
            break;
        }
      }
    }

    return true;
  };

  const buildCheckboxFields = () => {
    const columns = columnInfos.filter(columnInfo => {
      return columnInfo.type === 'boolean' && hiddenEditFields.indexOf(columnInfo.name) < 0;
    });
    if (!columns || columns.length === 0) {
      return <></>;
    }
    return (
      <>
        <label className={classes.booleanTableLabel}>Other:</label>
        <EditableBooleanTable aria-label="Other Fields">
          {columns?.map(columnInfo => (
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
          ))}
        </EditableBooleanTable>
      </>
    );
  };

  const buildTextInput = (columnInfo: ColumnInfo) => {
    const numberField = columnInfo.type === ColumnType.Number;
    const multiline = columnInfo.type === ColumnType.String && (columnInfo?.config as CustomColumnConfigString)?.multiline === true;
    return (
      <TextField
        className={classes.textField}
        id={columnInfo.name}
        label={columnInfo.displayName}
        disabled={formDisabled || (existingRosterEntry && !columnInfo.updatable)}
        required={columnInfo.required}
        multiline={multiline}
        rows={multiline ? 3 : 1}
        rowsMax={multiline ? 6 : 1}
        onChange={numberField ? onNumberFieldChanged(columnInfo.name) : onTextFieldChanged(columnInfo.name)}
        value={rosterEntry[columnInfo.name] || ''}
        type={numberField ? 'number' : 'text'}
      />
    );
  };

  const buildDateInput = (columnInfo: ColumnInfo) => {
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

  const buildDateTimeInput = (columnInfo: ColumnInfo) => {
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

  const buildEnumInput = (columnInfo: ColumnInfo) => {
    const options = (columnInfo.config as CustomColumnConfigEnum)?.options?.slice() ?? [];

    if (!columnInfo.required) {
      options.unshift({ id: '', label: '' });
    }

    return (
      <>
        <InputLabel id={`${columnInfo.name}-label`} className={classes.inputLabel} shrink>
          {columnInfo.displayName}
        </InputLabel>
        <Select
          className={classes.selectField}
          id={columnInfo.name}
          labelId={`${columnInfo.name}-label`}
          native
          disabled={formDisabled || (existingRosterEntry && !columnInfo.updatable)}
          label={columnInfo.displayName}
          value={rosterEntry[columnInfo.name] ?? ''}
          onChange={event => {
            updateRosterEntryProperty(columnInfo.name, event?.target.value as string);
          }}
          required={columnInfo.required}
          inputProps={{
            name: `${columnInfo.name}`,
            id: `${columnInfo.name}-select`,
          }}
        >
          {options.map(({ id, label }) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </Select>
      </>
    );
  };

  const buildInputFields = () => {
    const columns = columnInfos.filter(columnInfo => {
      return columnInfo.type !== 'boolean' && hiddenEditFields.indexOf(columnInfo.name) < 0;
    });
    return columns?.map(columnInfo => (
      <Grid key={columnInfo.name} item xs={6}>
        {buildInputFieldForColumnType(columnInfo)}
      </Grid>
    ));
  };

  const buildInputFieldForColumnType = (column: ColumnInfo) => {
    switch (column.type) {
      case ColumnType.String:
      case ColumnType.Number:
        return buildTextInput(column);
      case ColumnType.DateTime:
        return buildDateTimeInput(column);
      case ColumnType.Date:
        return buildDateInput(column);
      case ColumnType.Enum:
        return buildEnumInput(column);
      default:
        console.warn(`Unhandled column type found while creating input fields: ${column.type}`);
        return '';
    }
  };

  if (!open) {
    return <></>;
  }

  return (
    <>
      <Dialog className={classes.root} maxWidth="md" onClose={onClose} open={open}>
        <DialogTitle id="alert-dialog-title">{existingRosterEntry ? 'Edit Roster Entry' : 'New Roster Entry'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormControl required className={classes.selectField}>
                {orphanedRecord?.unit ? (
                  <Box className={classes.orphanLabel}>
                    {`Orphaned Record says: ${orphanedRecord?.unit}`}
                  </Box>
                ) : null}
                <InputLabel id="unit-label">Unit</InputLabel>
                <Select
                  labelId="unit-label"
                  native
                  disabled={formDisabled}
                  value={rosterEntry.unit}
                  onChange={onUnitChanged}
                  inputProps={{
                    name: 'unit',
                    id: 'unit-select',
                  }}
                >
                  {units && units.map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {buildInputFields()}
          </Grid>
          {buildCheckboxFields()}
        </DialogContent>
        <DialogActions className={classes.editRosterEntryDialogActions}>
          <Button disabled={formDisabled} variant="outlined" onClick={onClose} color="primary">
            Cancel
          </Button>
          <ButtonWithSpinner disabled={!canSave()} onClick={checkSave} color="primary" loading={saveRosterEntryLoading}>
            Save
          </ButtonWithSpinner>
        </DialogActions>
      </Dialog>
      <Dialog maxWidth="md" open={unitChangedPromptOpen}>
        <DialogTitle id="unit-changed">Unit Changed</DialogTitle>
        <DialogContent>
          Are you sure you want to move the individual to {getUnitName(rosterEntry.unit)}?
        </DialogContent>
        <DialogActions className={classes.unitChangedDialogActions}>
          <Button variant="outlined" onClick={cancelUnitChangedDialog} color="primary">
            No
          </Button>
          <Button onClick={() => onSave()} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
