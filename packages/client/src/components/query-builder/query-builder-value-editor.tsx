import React, {
  ReactElement,
  useEffect,
  useMemo,
} from 'react';
import {
  Checkbox,
  Grid,
  Select,
  Switch,
  TextField,
  Tooltip,
} from '@material-ui/core';
import moment from 'moment';
import {
  DatePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import _ from 'lodash';
import {
  getFullyQualifiedColumnDisplayName,
  validateMathematicExpression,
  validateTimeExpression,
  ColumnType,
  QueryValueScalarType,
  QueryValueType,
} from '@covid19-reports/shared';
import useStyles from './query-builder.styles';
import {
  getExpressionHelperText,
  getFieldDefaultQueryValue,
  queryDateFormat,
  ExpressionReference,
  QueryRow,
} from '../../utility/query-builder-utils';

const expressionFieldPlaceholder = '0';
const expressionCheckboxTooltip = 'Use Relative Value';
const relativeTimeExpressionDefault = ['Today', ''];
const relativeTimeExpressionTooltip = '+/- Days';

export type QueryBuilderValueEditorProps = {
  onChange: (row: QueryRow) => void;
  row: QueryRow;
  expressionRefsByType?: Map<QueryValueType, ExpressionReference[]>;
  disabled?: boolean;
};

export const QueryBuilderValueEditor = (props: QueryBuilderValueEditorProps) => {
  const { row, expressionRefsByType } = props;

  let editor: React.ReactElement<QueryBuilderValueEditorProps>;

  if (row.op === 'null' || row.op === 'notnull') {
    return null;
  }

  switch (row.field.type) {
    case ColumnType.Date:
      editor = <QueryBuilderDateTimeEditor expressionReferences={expressionRefsByType?.get(ColumnType.Date)} hasTime={false} {...props} />;
      break;
    case ColumnType.DateTime:
      editor = <QueryBuilderDateTimeEditor expressionReferences={expressionRefsByType?.get(ColumnType.DateTime)} hasTime {...props} />;
      break;
    case ColumnType.Boolean:
      editor = <QueryBuilderBooleanEditor {...props} />;
      break;
    case ColumnType.Enum:
      editor = <QueryBuilderEnumEditor {...props} />;
      break;
    default:
      editor = <QueryBuilderStringEditor {...props} />;
  }

  if (row.op === 'between') {
    editor = <QueryBuilderValueRangeEditor editorComponent={editor} {...props} />;
  }

  return editor;
};

const QueryBuilderStringEditor = ({ onChange, row, disabled }: QueryBuilderValueEditorProps) => {
  const classes = useStyles();

  const isExpressionValid = useMemo(() => {
    const { isValid } = validateTimeExpression(row.expression);
    return isValid;
  }, [row.expression]);

  const textField = () => {
    return (
      <TextField
        className={classes.textField}
        onChange={event => {
          onChange({
            ...row,
            value: event.target.value,
          });
        }}
        placeholder={row.field.displayName}
        type={row.field.type === ColumnType.Number ? 'number' : 'text'}
        value={row.value}
        disabled={disabled}
      />
    );
  };

  const handleExpressionChange = (expression: string) => {
    const { value } = validateMathematicExpression(expression);

    onChange({
      ...row,
      value,
      expression,
    });
  };

  const handleUseExpressionChange = (checked: boolean) => {
    const { value } = validateMathematicExpression(row.expression);

    onChange({
      ...row,
      value,
      expressionEnabled: checked,
    });
  };

  const expressionField = () => {
    return (
      <Tooltip title="e.g. 1 + 2 - 3.8 * 4 / 5.0">
        <TextField
          className={classes.textField}
          onChange={event => handleExpressionChange(event.target.value)}
          error={!isExpressionValid}
          helperText={getExpressionHelperText(row, isExpressionValid)}
          placeholder={expressionFieldPlaceholder}
          disabled={disabled}
        />
      </Tooltip>
    );
  };

  return (
    <div>
      {row.expressionEnabled ? expressionField() : textField()}
      {(row.op !== 'in' && row.field.type !== ColumnType.String) && (
        <Tooltip title={expressionCheckboxTooltip}>
          <Checkbox
            value={row.expressionEnabled}
            onChange={event => handleUseExpressionChange(event.target.checked)}
            disabled={disabled}
          />
        </Tooltip>
      )}
    </div>
  );
};

const QueryBuilderBooleanEditor = ({ onChange, row, disabled }: QueryBuilderValueEditorProps) => {
  return (
    <Switch
      checked={Boolean(row.value)}
      onChange={event => {
        onChange({
          ...row,
          value: event.target.checked,
        });
      }}
      color="primary"
      inputProps={{ 'aria-label': 'primary checkbox' }}
      disabled={disabled}
    />
  );
};

type QueryBuilderDateTimeEditorProps = QueryBuilderValueEditorProps & {
  hasTime: boolean;
  expressionReferences?: ExpressionReference[];
};

const QueryBuilderDateTimeEditor = ({ expressionReferences, hasTime, onChange, row, disabled }: QueryBuilderDateTimeEditorProps) => {
  const classes = useStyles();

  const isExpressionValid = useMemo(() => {
    const { isValid } = validateTimeExpression(row.expression);
    return isValid;
  }, [row.expression]);

  useEffect(() => {
    if (!row.value) {
      onChange({
        ...row,
        value: getFieldDefaultQueryValue(row.field),
      });
    }
  }, [onChange, row]);

  const Picker = hasTime ? DateTimePicker : DatePicker;
  const dateField = () => {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Picker
          className={classes.textField}
          format={hasTime ? 'MM/DD/YYYY hh:mm A' : 'MM/DD/YYYY'}
          placeholder={row.field.displayName}
          value={moment((row.value ? row.value : getFieldDefaultQueryValue(row.field)) as string)}
          onChange={date => {
            let value: string;
            if (date) {
              value = hasTime ? date.format() : date.format(queryDateFormat);
            } else {
              value = getFieldDefaultQueryValue(row.field) as string;
            }

            onChange({
              ...row,
              value,
            });
          }}
          disabled={disabled}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const handleExpressionChange = (expression: string) => {
    onChange({
      ...row,
      expression,
    });
  };

  const handleExpressionRefChange = (reference: string) => {
    onChange({
      ...row,
      expressionRef: reference,
    });
  };

  const handleUseExpressionChange = (checked: boolean) => {
    onChange({
      ...row,
      expressionEnabled: checked,
      expressionRef: '',
    });
  };

  const expressionOperandField = () => {
    return (
      <div>
        <Select
          native
          autoFocus
          value={row.expressionRef}
          onChange={event => handleExpressionRefChange(event.target.value as string)}
          disabled={disabled}
        >
          {
            expressionReferences?.map((ref: ExpressionReference) => {
              if (getFullyQualifiedColumnDisplayName(row.field) !== ref.displayName) {
                return (
                  <option key={ref.displayName} value={ref.reference}>
                    { ref.displayName }
                  </option>
                );
              }
              return '';
            })
          }
          <option key={relativeTimeExpressionDefault[0]} value={relativeTimeExpressionDefault[1]}>
            {relativeTimeExpressionDefault[0]}
          </option>
        </Select>
      </div>
    );
  };

  const expressionField = () => {
    return (
      <TextField
        type="number"
        className={classes.textField}
        value={row.expression}
        onChange={event => handleExpressionChange(event.target.value)}
        error={!isExpressionValid}
        helperText={relativeTimeExpressionTooltip}
        placeholder={expressionFieldPlaceholder}
        disabled={disabled}
      />
    );
  };

  return (
    <>
      {row.expressionEnabled ? (
        <Grid container spacing={2}>
          <Grid item>
            {expressionOperandField()}
          </Grid>
          <Grid item>
            {expressionField()}
            <Tooltip title={expressionCheckboxTooltip}>
              <Checkbox
                checked={row.expressionEnabled}
                onChange={event => handleUseExpressionChange(event.target.checked)}
                disabled={disabled}
              />
            </Tooltip>
          </Grid>
        </Grid>
      ) : (
        <>
          {dateField()}
          <Tooltip title={expressionCheckboxTooltip}>
            <Checkbox
              checked={row.expressionEnabled}
              onChange={event => handleUseExpressionChange(event.target.checked)}
              disabled={disabled}
            />
          </Tooltip>
        </>
      )}
    </>
  );
};

type QueryBuilderValueRangeEditorProps = QueryBuilderValueEditorProps & {
  editorComponent: ReactElement<QueryBuilderValueEditorProps>;
};

const QueryBuilderValueRangeEditor = ({ editorComponent, onChange, row, disabled }: QueryBuilderValueRangeEditorProps) => {
  // Convert the row value to a two-element array if necessary.
  useEffect(() => {
    let value = row.value;
    if (!_.isArray(row.value)) {
      value = [row.value, row.value];
    } else if (row.value.length !== 2) {
      value = [row.value[0], row.value[0]];
    }

    if (row.value !== value) {
      onChange({
        ...row,
        value,
      });
    }
  }, [row, onChange]);

  const handleValueChange = (value: QueryValueType, valueIndex: number) => {
    const rowValues = [...row.value as QueryValueScalarType[]];
    rowValues[valueIndex] = value as QueryValueScalarType;
    onChange({
      ...row,
      value: rowValues,
    });
  };

  if (!_.isArray(row.value)) {
    return null;
  }

  return (
    <Grid item container spacing={2}>
      {_.range(2).map((__, index) => (
        <Grid item key={index}>
          {React.cloneElement(editorComponent, {
            onChange: (queryRow: QueryRow) => handleValueChange(queryRow.value, index),
            row: {
              ...row,
              value: (row.value as QueryValueScalarType[])[index],
            },
            disabled,
          })}
        </Grid>
      ))}
    </Grid>
  );
};

const QueryBuilderEnumEditor = (props: QueryBuilderValueEditorProps) => {
  const classes = useStyles();
  const { onChange, row, disabled } = props;

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
      disabled={disabled}
    >
      {row.field.enumItems!.map(({ label, value }) => (
        <option key={label} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
};
