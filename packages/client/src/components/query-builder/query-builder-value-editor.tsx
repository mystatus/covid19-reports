import React, {
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
import { ColumnType } from '@covid19-reports/shared';
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

export interface QueryBuilderRowValueProps {
  onChange: (row: QueryRow) => void;
  row: QueryRow;
}

export const QueryBuilderValueEditor = (props: QueryBuilderRowValueProps) => {
  const { row } = props;

  let editor: React.ReactElement<QueryBuilderRowValueProps>;

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

const QueryBuilderStringEditor = ({ onChange, row }: QueryBuilderRowValueProps) => {
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

const QueryBuilderBooleanEditor = ({ onChange, row }: QueryBuilderRowValueProps) => {
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

interface DateTimeValueEditorProps extends QueryBuilderRowValueProps {
  hasTime: boolean;
}

const QueryBuilderDateTimeEditor = ({ hasTime, onChange, row }: DateTimeValueEditorProps) => {
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
      <Tooltip title={expressionCheckboxTooltip}>
        <Checkbox
          checked={row.expressionEnabled}
          onChange={event => handleUseExpressionChange(event.target.checked)}
        />
      </Tooltip>
    </div>
  );
};

interface QueryBuilderValueRangeEditorProps extends QueryBuilderRowValueProps {
  editorComponent: React.ReactElement<QueryBuilderRowValueProps>;
}

const QueryBuilderValueRangeEditor = ({ editorComponent, onChange, row }: QueryBuilderValueRangeEditorProps) => {
  const range = useMemo(() => {
    return {
      min: _.isArray(row.value) ? row.value[0] : undefined,
      max: _.isArray(row.value) ? row.value[1] : undefined,
    };
  }, [row]);

  const rangeKeys = _.keys(range) as Array<keyof typeof range>;

  if (row.expressionEnabled) {
    return (
      <Grid item container spacing={2}>
        {rangeKeys.map(key => (
          <Grid item key={key}>
            {React.cloneElement(editorComponent)}
          </Grid>
        ))}x
      </Grid>
    );
  }

  return (
    <Grid item container spacing={2}>
      {rangeKeys.map(key => (
        <Grid item key={key}>
          {React.cloneElement(editorComponent, {
            onChange: (queryRow: QueryRow) => {
              onChange({ ...queryRow });
            },
            row: {
              ...row,
              value: range[key]!,
            },
          })}
        </Grid>
      ))}
    </Grid>
  );
};

const QueryBuilderEnumEditor = (props: QueryBuilderRowValueProps) => {
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
