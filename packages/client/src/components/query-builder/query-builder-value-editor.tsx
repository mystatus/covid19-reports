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
import {
  ColumnType,
  QueryValueScalarType,
  QueryValueType,
} from '@covid19-reports/shared';
import _ from 'lodash';
import useStyles from './query-builder.styles';
import {
  evalDateExpression,
  evalMathExpression,
  getExpressionHelperText,
  getFieldDefaultQueryValue,
  queryDateFormat,
  QueryRow,
} from '../../utility/query-builder-utils';

const expressionFieldPlaceholder = 'Expression';
const expressionCheckboxTooltip = 'Use Expression';

export type QueryBuilderValueEditorProps = {
  onChange: (row: QueryRow) => void;
  row: QueryRow;
};

export const QueryBuilderValueEditor = (props: QueryBuilderValueEditorProps) => {
  const { row } = props;

  let editor: React.ReactElement<QueryBuilderValueEditorProps>;

  if (row.op === 'null' || row.op === 'notnull') {
    return null;
  }

  switch (row.field.type) {
    case ColumnType.Date:
      editor = <QueryBuilderDateTimeEditor hasTime={false} {...props} />;
      break;
    case ColumnType.DateTime:
      editor = <QueryBuilderDateTimeEditor hasTime {...props} />;
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

const QueryBuilderStringEditor = ({ onChange, row }: QueryBuilderValueEditorProps) => {
  const classes = useStyles();

  const isExpressionValid = useMemo(() => {
    const { isValid } = evalDateExpression(row.expression);
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
      />
    );
  };

  const handleExpressionChange = (expression: string) => {
    const { value } = evalMathExpression(expression);

    onChange({
      ...row,
      value,
      expression,
    });
  };

  const handleUseExpressionChange = (checked: boolean) => {
    const { value } = evalMathExpression(row.expression);

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
          />
        </Tooltip>
      )}
    </div>
  );
};

const QueryBuilderBooleanEditor = ({ onChange, row }: QueryBuilderValueEditorProps) => {
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
    />
  );
};

type QueryBuilderDateTimeEditorProps = QueryBuilderValueEditorProps & {
  hasTime: boolean;
};

const QueryBuilderDateTimeEditor = ({ hasTime, onChange, row }: QueryBuilderDateTimeEditorProps) => {
  const classes = useStyles();

  const isExpressionValid = useMemo(() => {
    const { isValid } = evalDateExpression(row.expression);
    return isValid;
  }, [row.expression]);

  useEffect(() => {
    if (!row.value) {
      onChange({
        ...row,
        value: getFieldDefaultQueryValue(row.field),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        />
      </MuiPickersUtilsProvider>
    );
  };

  const handleExpressionChange = (expression: string) => {
    const { value } = evalDateExpression(expression);

    onChange({
      ...row,
      value,
      expression,
    });
  };

  const expressionField = () => {
    return (
      <Tooltip
        title={(
          <span className={classes.tooltipMultiline}>
            {'e.g. { "days": -1, "hours" : 12, "mins": 15 } \nNote: format is relative to "today" at 00:00 hours'}
          </span>
        )}
      >
        <TextField
          className={classes.textField}
          value={row.expression}
          onChange={event => handleExpressionChange(event.target.value)}
          error={!isExpressionValid}
          helperText={getExpressionHelperText(row, isExpressionValid)}
          placeholder={expressionFieldPlaceholder}
        />
      </Tooltip>
    );
  };

  const handleUseExpressionChange = (checked: boolean) => {
    const { value } = evalDateExpression(row.expression);

    onChange({
      ...row,
      value,
      expressionEnabled: checked,
    });
  };

  return (
    <div>
      {row.expressionEnabled ? expressionField() : dateField()}
      {row.op !== 'between' && (
        <Tooltip title={expressionCheckboxTooltip}>
          <Checkbox
            checked={row.expressionEnabled}
            onChange={event => handleUseExpressionChange(event.target.checked)}
          />
        </Tooltip>
      )}
    </div>
  );
};

type QueryBuilderValueRangeEditorProps = QueryBuilderValueEditorProps & {
  editorComponent: ReactElement<QueryBuilderValueEditorProps>;
};

const QueryBuilderValueRangeEditor = ({ editorComponent, onChange, row }: QueryBuilderValueRangeEditorProps) => {
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
          })}
        </Grid>
      ))}
    </Grid>
  );
};

const QueryBuilderEnumEditor = (props: QueryBuilderValueEditorProps) => {
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
      {row.field.enumItems!.map(({ label, value }) => (
        <option key={label} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
};
