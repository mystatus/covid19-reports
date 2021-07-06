import MomentUtils from '@date-io/moment';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Checkbox,
  Collapse,
  Grid,
  IconButton,
  Select,
  Switch,
  TextField,
  Tooltip,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SaveIcon from '@material-ui/icons/Save';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {
  DatePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment, { Moment } from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import deepEquals from 'fast-deep-equal';
import { SavedFilterClient } from '../../client/api';
import useDeepEquality from '../../hooks/use-deep-equality';
import usePersistedState from '../../hooks/use-persisted-state';
import { ApiFilterConfiguration, ApiSavedFilter } from '../../models/api-response';
import { UserSelector } from '../../selectors/user.selector';
import useStyles from './query-builder.styles';

const toDate = (date: Moment) => date.format('YYYY-MM-DD');

export enum QueryFieldType {
  String = 'string',
  Boolean = 'boolean',
  Date = 'date',
  DateTime = 'datetime',
  Number = 'number',
  Enum = 'enum',
}

export type QueryOp = '=' | '<>' | '~' | '>' | '<' | 'startsWith' | 'endsWith' | 'in' | 'between';
export type QueryValueScalarType = string | number | boolean | undefined;
export type QueryValueType = QueryValueScalarType | QueryValueScalarType[];

export type QueryFieldPickListItem = {
  label: string
  value: string | number
};

export type QueryField = {
  editor?: React.ReactElement<ValueEditorProps>
  displayName?: string
  name: string
  type: QueryFieldType
  items?: QueryFieldPickListItem[],
};

/**
 This type is used as the react state for a given row/line
 in the query builder UI.
 */
export type QueryRow = {
  field: QueryField
  op: QueryOp
  value: QueryValueType
  expression: string
  expressionEnabled: boolean
};

/**
 This type is what actually gets sent over the wire to the server
 for the query building.
 */
export type QueryFilterState = {
  [key: string]: {
    op: QueryOp
    value: QueryValueType
    expression: string
    expressionEnabled: boolean
  }
};

interface ValueEditorProps {
  onChange: (row: QueryRow) => void
  row: QueryRow
}

const StringValue = ({ onChange, row }: ValueEditorProps) => {
  const classes = useStyles();
  const [isExpression, setIsExpression]: any[] = useState(false);
  const [expressionValid, setExpressionValid]: any[] = useState(false);

  const validateExpression = (exp: string) => {
    // Ensure only mathematical expressions are allowed, we add the following annotation
    // so the linter doesn't complain about useless escape characters
    // eslint-disable-next-line
    const regex = new RegExp('^([-+\/*]\d+(\.\d+)?)*');
    if (regex.test(exp)) {
      try {
        row.expression = exp;
        // Disable warning about eval since we use the regex to validate
        // the input as mathematical expression
        // eslint-disable-next-line
        row.value = eval(exp);
        setExpressionValid(true);
      } catch (e) {
        setExpressionValid(false);
      }
    } else {
      setExpressionValid(false);
    }
  };

  const textField = () => {
    return (
      <TextField
        className={classes.textField}
        onChange={event => {
          row.value = event.target.value;
          onChange({ ...row });
        }}
        placeholder={isExpression === true ? '{{ expression... }}' : row.field.displayName}
        type={row.field.type === QueryFieldType.Number ? 'number' : 'text'}
        value={row.value}
      />
    );
  };

  const expressionField = () => {
    return (
      <Tooltip title="e.g. 1 + 2 - 3.8 * 4 / 5.0">
        <TextField
          className={classes.textField}
          onChange={event => {
            validateExpression(event.target.value);
            onChange({ ...row });
          }}
          error={!expressionValid}
          helperText={!expressionValid ? 'Invalid expression' : row.value}
          placeholder={isExpression === true && !row.expression ? '{{ expression... }}' : row.expression}
          type="text"
        />
      </Tooltip>
    );
  };

  return (
    <div id={uuidv4()}>
      {isExpression ? expressionField() : textField()}
      {(row.op !== 'in' && row.field.type !== QueryFieldType.String) && (
        <Tooltip title="Use Expression">
          <Checkbox
            onChange={event => {
              setIsExpression(event.target.checked);
              row.expressionEnabled = event.target.checked;
              if (row.expressionEnabled) {
                validateExpression(row.expression);
              }
              onChange({ ...row });
            }}
          />
        </Tooltip>
      )}
    </div>
  );
};

const BooleanValue = ({ onChange, row }: ValueEditorProps) => {
  return (
    <Switch
      checked={Boolean(row.value)}
      onChange={event => {
        row.value = event.target.checked;
        onChange({ ...row });
      }}
      color="primary"
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  );
};

interface DateTimeValueEditorProps extends ValueEditorProps {
  hasTime: boolean
}


const DateTimeValue = ({ hasTime, onChange, row }: DateTimeValueEditorProps) => {
  const classes = useStyles();
  const [isExpression, setIsExpression]: any[] = useState(row.expressionEnabled);
  const [expressionValid, setExpressionValid]: any[] = useState(false);

  useEffect(() => {
    if (!row.value) {
      onChange({ ...row, value: getDefaultValueForType(row.field) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateExpression = (exp: string) => {
    row.expression = exp;
    try {
      if (exp) {
        const jsonExp = JSON.parse(exp);
        row.value = moment().startOf('day').add(jsonExp).toISOString();
        setExpressionValid(true);
      }
    } catch (e) {
      setExpressionValid(false);
    }
  };


  const Picker = hasTime ? DateTimePicker : DatePicker;
  const dateField = () => {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Picker
          className={classes.textField}
          id={row.field.name}
          format={hasTime ? 'MM/DD/YYYY hh:mm A' : 'MM/DD/YYYY'}
          placeholder={row.field.displayName}
          value={moment((row.value ? row.value : getDefaultValueForType(row.field)) as string)}
          onChange={date => {
            if (date) {
              row.value = hasTime ? date.format() : toDate(date);
            } else {
              row.value = getDefaultValueForType(row.field);
            }
            onChange({ ...row });
          }}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const expressionField = () => {
    // This hack (wrapping the title with a span elem) is needed to get multi-line tooltip to work
    return (
      <Tooltip title={(
        <span style={{ whiteSpace: 'pre-line' }}>
          {'e.g. { "days": -1, "hours" : 12, "mins": 15 } \nNote: format is relative to "today" at 00:00 hours'}
        </span>
      )}
      >
        <TextField
          className={classes.textField}
          onChange={event => {
            validateExpression(event.target.value);
            onChange({ ...row });
          }}
          error={!expressionValid}
          helperText={!expressionValid ? 'Invalid expression' : row.value}
          placeholder={isExpression === true && !row.expression ? '{{ expression... }}' : row.expression}
          type="text"
        />
      </Tooltip>
    );
  };

  return (
    <div id={uuidv4()}>
      {isExpression === true ? expressionField() : dateField()}
      <Tooltip title="Use Expression">
        <Checkbox
          onChange={event => {
            setIsExpression(event.target.checked);
            row.expressionEnabled = event.target.checked;
            if (row.expressionEnabled) {
              validateExpression(row.expression);
            }
            onChange({ ...row });
          }}
        />
      </Tooltip>
    </div>
  );
};


interface RangeValueEditorProps extends ValueEditorProps {
  component: React.ReactElement<ValueEditorProps>
}

const RangeValue = ({ component, onChange, row }: RangeValueEditorProps) => {
  const array = [undefined, undefined]
    .map((_: any, index: number) => {
      return (Array.isArray(row.value) && row.value.length > index) ? row.value[index] : _;
    });

  if (row.expressionEnabled) {
    return (
      <Grid item container spacing={2}>
        {array.map(() => (
          <Grid item>
            {React.cloneElement(component)}
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid item container spacing={2}>
      {array.map((value: QueryValueType, index: number) => (
        <Grid item key={['min', 'max'][index]}>
          {React.cloneElement(component, {
            onChange: ({ value: subValue }: QueryRow) => {
              array[index] = subValue;
              row.value = array.slice();
              onChange(row);
            },
            row: { ...row, value },
          })}
        </Grid>
      ))}
    </Grid>
  );

};

const PickListValue = (props: ValueEditorProps) => {
  const classes = useStyles();

  const { onChange, row } = props;
  return (
    <Select
      native
      autoFocus
      className={classes.pickListSelect}
      value={row.value}
      onChange={event => {
        onChange({
          ...row,
          value: event.target.value as string | number,
        });
      }}
    >
      {row.field.items!.map(({ label, value }) => (
        <option key={label} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
};

const Editor = (props: ValueEditorProps) => {
  let { editor } = props.row.field;

  if (!editor) {
    if (props.row.field.items) {
      editor = <PickListValue {...props} />;
    } else {
      switch (props.row.field.type) {
        case QueryFieldType.Date:
          editor = <DateTimeValue hasTime={false} {...props} />;
          break;
        case QueryFieldType.DateTime:
          editor = <DateTimeValue hasTime {...props} />;
          break;
        case QueryFieldType.Boolean:
          editor = <BooleanValue {...props} />;
          break;
        default:
          editor = <StringValue {...props} />;
      }
    }
  }

  if (props.row.op === 'between') {
    return <RangeValue component={editor} {...props} />;
  }
  return editor;
};

type FieldSelectorProps = {
  fields: QueryField[]
  onChange: (field: QueryField) => void
};

const FieldSelector = (props: FieldSelectorProps) => {
  const { fields, onChange } = props;
  return (
    <Select
      native
      autoFocus
      fullWidth
      onChange={event => {
        onChange(fields[event.target.value as number]);
      }}
    >
      {fields.map((field, index) => (
        <option key={field.name} value={index}>
          {field.displayName}
        </option>
      ))}
    </Select>
  );
};

type OpsDesc = {
  [key: string]: string
};

type QueryOpSelectorProps = {
  onChange: (op: QueryOp) => void
  value: QueryOp
  ops: OpsDesc
};

const getOpDesc = (field: QueryField): OpsDesc => {
  if (field.items || field.type === QueryFieldType.Boolean) {
    return {
      '=': 'is',
      '<>': 'is not',
    };
  }
  if (field.type === QueryFieldType.String) {
    return {
      '=': 'is',
      in: 'in',
      '<>': 'is not',
      '~': 'contains',
      startsWith: 'starts with',
      endsWith: 'ends with',
    };
  }
  if (field.type === QueryFieldType.Date || field.type === QueryFieldType.DateTime) {
    return {
      '=': 'is',
      '<>': 'is not',
      '>': 'after',
      '<': 'before',
      between: 'between',
    };
  }
  if (field.type === QueryFieldType.Number) {
    return {
      '=': 'is',
      '<>': 'is not',
      '>': 'greater than',
      '<': 'less than',
      between: 'between',
    };
  }
  return {};
};

const getDefaultOp = (field: QueryField): QueryOp => {
  const opDesc = getOpDesc(field);
  if (opDesc) {
    return Object.keys(opDesc)[0] as QueryOp;
  }
  return '=';
};

const isArrayOp = (op: QueryOp) => op === 'between' || op === 'in';

const getDefaultValueForType = (field: QueryField): QueryValueScalarType => {
  if (field.items?.length) {
    return field.items[0].value;
  }
  if (field.type === QueryFieldType.Boolean) {
    return false;
  }
  if (field.type === QueryFieldType.Date) {
    return toDate(moment());
  }
  if (field.type === QueryFieldType.DateTime) {
    const today = new Date(Date.now());
    return today.toISOString();
  }
  return '';
};

const getDefaultValue = (field: QueryField, op: QueryOp): QueryValueType => {
  const isArray = isArrayOp(op);
  const value = getDefaultValueForType(field);
  return isArray ? [value] : value;
};

const getNewValue = (row: QueryRow, newField: QueryField, newOp: QueryOp): QueryValueType => {
  if (row.field.items || newField.items) {
    return getDefaultValueForType(newField);
  }
  if (row.field.type === newField.type) {
    if (isArrayOp(row.op) === isArrayOp(newOp)) {
      return row.value;
    }
    if (isArrayOp(newOp)) {
      return [row.value as QueryValueScalarType];
    }
    if (Array.isArray(row.value)) {
      return row.value[0];
    }
  }
  return getDefaultValueForType(newField);
};

const QueryOpSelector = (props: QueryOpSelectorProps) => {
  const { onChange, ops, value } = props;
  return (
    <Select
      native
      autoFocus
      fullWidth
      value={value}
      onChange={event => {
        onChange(event.target.value as QueryOp);
      }}
    >
      {Object.entries(ops).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </Select>
  );
};

type QueryBuilderRowProps = {
  availableFields: QueryField[]
  onChange: (row: QueryRow) => void
  row: QueryRow
};

const QueryBuilderRow = (props: QueryBuilderRowProps) => {
  const {
    availableFields, onChange, row,
  } = props;

  const ops = getOpDesc(row.field);

  return (
    <>
      <Grid item xs={3}>
        <FieldSelector
          fields={[row.field, ...availableFields].filter(Boolean) as QueryField[]}
          onChange={field => {
            const newOps = getOpDesc(field);
            const op = row.op in newOps ? row.op : getDefaultOp(field);
            onChange({ field, op, value: getNewValue(row, field, op), expression: '', expressionEnabled: false });
          }}
        />
      </Grid>

      {ops && (
        <Grid item xs={2}>
          <QueryOpSelector
            onChange={op => {
              onChange({
                field: row.field,
                op,
                value: getNewValue(row, row.field, op),
                expression: '',
                expressionEnabled: false,
              });
            }}
            ops={ops}
            value={row.op}
          />
        </Grid>
      )}

      <Grid item>
        <Editor onChange={onChange} row={row} />
      </Grid>
    </>
  );
};

export interface QueryBuilderProps {
  fields: QueryField[]
  onChange: (query: QueryFilterState | undefined) => void
  open: boolean
  persistKey?: string
  savedFilters?: [ApiSavedFilter[], React.Dispatch<React.SetStateAction<ApiSavedFilter[]>>]
  selectedSavedFilter?: [ApiSavedFilter | null, React.Dispatch<React.SetStateAction<ApiSavedFilter | null>>]
}

function toQuery(rows: QueryRow[]) {
  const queryableRows: QueryRow[] = rows.filter(row => row.field && row.value !== '');
  const query: QueryFilterState = {};
  for (const { field, op, value, expression, expressionEnabled } of queryableRows) {
    if (value) {
      if (op === 'in') {
        // handle "dirty" lists, e.g.  1000000001 ,,  ,1000000003 1000000004;1000000005
        const arrayOfValues = String(value).trim().split(/[\s,;]+/).filter(vl => vl);
        // don't add empty queries
        if (arrayOfValues && arrayOfValues.length) {
          query[field!.name] = {
            op,
            value: arrayOfValues,
            expression,
            expressionEnabled,
          };
        }
      } else {
        query[field!.name] = { op, value, expression, expressionEnabled };
      }
    }
  }
  return queryableRows.length ? query : undefined;
}

function toRows(filterConfiguration: ApiFilterConfiguration, fields: QueryField[]) {
  return Object.entries(filterConfiguration).map(([key, value]) => {
    return {
      field: fields.find(field => field.name === key)!,
      op: value.op,
      value: value.value,
    } as QueryRow;
  });
}

export const QueryBuilder = (props: QueryBuilderProps) => {
  const classes = useStyles();
  const {
    fields, onChange, open, persistKey,
  } = props;
  const [savedFilters, setSavedFilters] = props.savedFilters ?? [];
  const [selectedSavedFilter, setSelectedSavedFilter] = props.selectedSavedFilter ?? [];
  const [rows, setRows] = usePersistedState<QueryRow[]>(persistKey, []);
  const availableFields = fields.filter(field => !rows.some(row => row.field.name === field.name));
  const [filterState, setFilterState] = useDeepEquality<QueryFilterState | undefined>();
  const [hasChanges, setHasChanges] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const filterNameRef = useRef<HTMLInputElement>();
  const org = useSelector(UserSelector.org)!;

  const addRow = () => {
    if (availableFields.length > 0) {
      const field = availableFields[0];
      const op = getDefaultOp(field);
      setRows([...rows, { field, op, value: getDefaultValue(field, op), expression: '', expressionEnabled: false }]);
    }
  };

  const removeRow = (rowIndex: number) => () => {
    setRows(rows.filter((_, index) => index !== rowIndex));
  };

  const onRowChange = (index: number) => (row: QueryRow) => {
    const newRows = [...rows];
    newRows.splice(index, 1, row);
    setRows(newRows);
  };

  const saveFilter = async () => {
    if (!saveOpen && !selectedSavedFilter) {
      setSaveOpen(true);
    } else {
      const query = toQuery(rows);
      console.log({ filterNameRef });
      if (query && filterNameRef.current) {
        if (selectedSavedFilter && !saveOpen) {
          const filter = await SavedFilterClient.update(org.id, {
            ...selectedSavedFilter,
            filterConfiguration: query as unknown as ApiFilterConfiguration,
          });
          if (setSavedFilters) {
            setSavedFilters([...(savedFilters ?? []).filter(f => f.id !== filter.id), filter].sort((a, b) => (a.name < b.name ? -1 : 1)));
          }
          if (setSelectedSavedFilter) {
            setSelectedSavedFilter(filter);
          }

        } else {
          const filter = await SavedFilterClient.create(org.id, {
            name: filterNameRef.current.value,
            entityType: 'RosterEntry',
            filterConfiguration: query as unknown as ApiFilterConfiguration,
          });
          if (setSavedFilters) {
            setSavedFilters([...(savedFilters ?? []), filter].sort((a, b) => (a.name < b.name ? -1 : 1)));
          }
          if (setSelectedSavedFilter) {
            setSelectedSavedFilter(filter);
          }
        }
      }
      setSaveOpen(false);
    }
  };

  useEffect(() => {
    const query = toQuery(rows);
    setFilterState(query);
    if (selectedSavedFilter) {
      setHasChanges(!deepEquals(query, selectedSavedFilter.filterConfiguration));
    } else {
      setHasChanges(!!query);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, setFilterState]);

  useEffect(() => {
    onChange(filterState);
  }, [filterState, onChange]);

  useEffect(() => {
    onChange(filterState);
  }, [filterState, onChange]);

  useEffect(() => {
    if (open && rows.length === 0) {
      addRow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!selectedSavedFilter) {
      setRows([]);
    } else {
      setRows(toRows(selectedSavedFilter.filterConfiguration, fields));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSavedFilter, setRows]);

  return (
    <div className={classes.root}>
      <Collapse in={open}>
        <div className={classes.rowsContainer}>
          {rows.map((row, index) => (
            <Grid container spacing={2} key={row.field.name}>
              <QueryBuilderRow
                availableFields={availableFields}
                onChange={onRowChange(index)}
                row={row}
              />
              <IconButton
                className={classes.removeRowButton}
                onClick={removeRow(index)}
              >
                <HighlightOffIcon />
              </IconButton>
            </Grid>
          ))}
        </div>
        {rows.every(row => row.field) && (
          <Button
            aria-label="Add filter"
            className={classes.addRowButton}
            onClick={addRow}
            size="small"
            startIcon={<AddCircleIcon />}
            variant="outlined"
          >
            Add Filter
          </Button>
        )}
        {hasChanges && (
          <div>
            <Collapse in={saveOpen}>
              <TextField
                className={classes.textField}
                inputRef={filterNameRef}
              />
            </Collapse>
            <Button
              aria-label="Save Filter"
              className={classes.addRowButton}
              onClick={saveFilter}
              size="small"
              startIcon={<SaveIcon />}
              variant="outlined"
            >
              Save {saveOpen ? '' : 'Filter'}
            </Button>
            {selectedSavedFilter && (
              <>
                {saveOpen ? (
                  <Button
                    aria-label="Cancel"
                    className={classes.addRowButton}
                    onClick={() => setSaveOpen(false)}
                    size="small"
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    aria-label="Save a Copy"
                    className={classes.addRowButton}
                    onClick={() => setSaveOpen(true)}
                    size="small"
                    startIcon={<FileCopyIcon />}
                    variant="outlined"
                  >
                    Save a Copy
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </Collapse>
    </div>
  );
};
