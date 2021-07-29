import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { v4 as uuidv4 } from 'uuid';
import {
  RosterColumnType,
  UpdateCustomColumnBody,
} from '@covid19-reports/shared';
import useStyles from './edit-column-dialog.styles';
import {
  ApiRosterColumnInfo,
  ApiRosterCustomColumnConfig,
  ApiRosterEnumColumnConfig,
  ApiRosterEnumColumnConfigOption,
  ApiRosterStringColumnConfig,
  rosterColumnTypeDisplayName,
} from '../../../models/api-response';
import { EditableBooleanTable } from '../../tables/editable-boolean-table';
import { formatErrorMessage } from '../../../utility/errors';
import { RosterClient } from '../../../client/roster.client';

export interface EditColumnDialogProps {
  open: boolean;
  orgId?: number;
  column?: ApiRosterColumnInfo;
  onClose?: () => void;
  onError?: (error: string) => void;
}

type CustomFlag = {
  label: string;
  key: keyof Pick<ApiRosterStringColumnConfig, 'multiline'>;
};

const customFlagsForType = (type: RosterColumnType): CustomFlag[] => {
  switch (type) {
    case RosterColumnType.String:
      return [{
        label: 'Multiline',
        key: 'multiline',
      }];
    default:
      return [];
  }
};

const isCustomFlagSet = (config: ApiRosterCustomColumnConfig, type: RosterColumnType, customFlag: CustomFlag): boolean => {
  if (type === RosterColumnType.String) {
    const cfg = config as ApiRosterStringColumnConfig;
    return cfg[customFlag.key] === true;
  }
  return false;
};

const setCustomFlag = (config: ApiRosterCustomColumnConfig, type: RosterColumnType, customFlag: CustomFlag, value: boolean) => {
  if (type === RosterColumnType.String) {
    const cfg = config as ApiRosterStringColumnConfig;
    cfg[customFlag.key] = value;
  }
  return { ...config };
};

const getEnumOptions = (config: ApiRosterCustomColumnConfig, type: RosterColumnType): ApiRosterEnumColumnConfigOption[] => {
  if (type !== RosterColumnType.Enum) {
    throw new Error('Invalid call to getEnumOptions for non-enum type');
  }
  return (config as ApiRosterEnumColumnConfig).options ?? [];
};

const addEnumOption = (config: ApiRosterCustomColumnConfig, type: RosterColumnType): ApiRosterEnumColumnConfig => {
  return {
    ...config,
    options: [...getEnumOptions(config, type), {
      id: uuidv4(),
      label: '',
    }],
  };
};

const editEnumOption = (config: ApiRosterCustomColumnConfig, type: RosterColumnType, id: string, label: string): ApiRosterEnumColumnConfig => {
  return {
    ...config,
    options: getEnumOptions(config, type).map(option => {
      if (option.id === id) {
        option.label = label;
      }
      return option;
    }),
  };
};

const deleteEnumOption = (config: ApiRosterCustomColumnConfig, type: RosterColumnType, id: string): ApiRosterEnumColumnConfig => {
  return {
    ...config,
    options: getEnumOptions(config, type).filter(option => option.id !== id),
  };
};

export const EditColumnDialog = (props: EditColumnDialogProps) => {
  const classes = useStyles();
  const [formDisabled, setFormDisabled] = useState(false);
  const {
    open, orgId, column, onClose, onError,
  } = props;

  const existingColumn = !!column;
  const [displayName, setDisplayName] = useState(column?.displayName || '');
  const [type, setType] = useState(column?.type || RosterColumnType.String);
  const [pii, setPII] = useState(column?.pii || false);
  const [phi, setPHI] = useState(column?.phi || false);
  const [required, setRequired] = useState(column?.required || false);
  const [config, setConfig] = useState<ApiRosterCustomColumnConfig>(column?.config || {});

  if (!open) {
    return <></>;
  }

  const onInputChanged = (func: (f: string) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.value);
  };

  const onColumnTypeChanged = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as RosterColumnType);
  };

  const onFlagChanged = (func: (f: boolean) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.checked);
  };

  const onCustomFlagChanged = (customFlag: CustomFlag) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(setCustomFlag(config, type, customFlag, event.target.checked));
  };

  const onCustomEnumChanged = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(editEnumOption(config, type, id, event.target.value));
  };

  const onSave = async () => {
    setFormDisabled(true);
    const body: UpdateCustomColumnBody = {
      pii: pii || phi,
      phi,
      required,
      config,
    };
    try {
      if (existingColumn) {
        await RosterClient.updateCustomColumn(orgId!, column!.name, body);
      } else {
        await RosterClient.addCustomColumn(orgId!, {
          ...body,
          displayName,
          type,
        });
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
    return !formDisabled && displayName.length > 0;
  };

  return (
    <Dialog className={classes.root} maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingColumn ? 'Edit Roster Column' : 'New Roster Column'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography className={classes.headerLabel}>Name:</Typography>
            <TextField
              className={classes.textField}
              id="display-name"
              disabled={formDisabled || existingColumn}
              multiline
              rowsMax={2}
              value={displayName}
              onChange={onInputChanged(setDisplayName)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography className={classes.headerLabel}>Type:</Typography>
            <Select
              className={classes.typeSelect}
              disabled={formDisabled || existingColumn}
              value={type}
              onChange={onColumnTypeChanged}
            >
              {Object.values(RosterColumnType).map(columnType => (
                <MenuItem key={columnType} value={columnType}>
                  {rosterColumnTypeDisplayName(columnType)}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {type === RosterColumnType.Enum && (
            <Grid item xs={12}>
              <Typography className={classes.headerLabel}>Options:</Typography>

              {getEnumOptions(config, type).map(({ id, label }) => (
                <Grid key={id} container item xs={12} spacing={1}>
                  <Grid item xs={10}>
                    <TextField
                      className={classes.textField}
                      disabled={formDisabled}
                      onChange={onCustomEnumChanged(id)}
                      size="small"
                      value={label}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      className={classes.removeEnumButton}
                      onClick={() => setConfig(deleteEnumOption(config, type, id))}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Button
                aria-label="Add option"
                className={classes.addEnumButton}
                onClick={() => setConfig(addEnumOption(config, type))}
                size="small"
                startIcon={<AddCircleIcon />}
                variant="outlined"
              >
                Add Option
              </Button>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography className={classes.headerLabel}>Flags:</Typography>
            <EditableBooleanTable aria-label="Flags">
              <TableRow>
                <TableCell>Contains PII</TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled || phi}
                    checked={pii || phi}
                    onChange={onFlagChanged(setPII)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Contains PHI</TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled}
                    checked={phi}
                    onChange={onFlagChanged(setPHI)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Required</TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled}
                    checked={required}
                    onChange={onFlagChanged(setRequired)}
                  />
                </TableCell>
              </TableRow>
              {customFlagsForType(type).map((flag: CustomFlag) => (
                <TableRow key={flag.key}>
                  <TableCell>{flag.label}</TableCell>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      disabled={formDisabled}
                      checked={isCustomFlagSet(config, type, flag)}
                      onChange={onCustomFlagChanged(flag)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </EditableBooleanTable>
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
};
