import React, {
  useEffect,
  useState,
} from 'react';
import {
  Checkbox,
  Grid,
  Select,
  Switch,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import {
  DatePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { ColumnType, QueryValueType } from '@covid19-reports/shared';
import useStyles from './query-builder.styles';
import {
  getFieldDefaultQueryValue,
  queryDateFormat,
  QueryRow,
} from '../../utility/query-builder-utils';

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
    editor = <QueryBuilderValueRangeEditor component={editor} {...props} />;
  }

  return editor;
};

const QueryBuilderStringEditor = ({ onChange, row }: QueryBuilderRowValueProps) => {
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
          onChange({
            ...row,
            value: event.target.value,
          });
        }}
        placeholder={isExpression === true ? '{{ expression... }}' : row.field.displayName}
        type={row.field.type === ColumnType.Number ? 'number' : 'text'}
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
      {(row.op !== 'in' && row.field.type !== ColumnType.String) && (
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

const QueryBuilderBooleanEditor = ({ onChange, row }: QueryBuilderRowValueProps) => {
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

interface DateTimeValueEditorProps extends QueryBuilderRowValueProps {
  hasTime: boolean;
}

const QueryBuilderDateTimeEditor = ({ hasTime, onChange, row }: DateTimeValueEditorProps) => {
  const classes = useStyles();
  const [isExpression, setIsExpression]: any[] = useState(row.expressionEnabled);
  const [expressionValid, setExpressionValid]: any[] = useState(false);

  useEffect(() => {
    if (!row.value) {
      onChange({ ...row, value: getFieldDefaultQueryValue(row.field) });
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
          value={moment((row.value ? row.value : getFieldDefaultQueryValue(row.field)) as string)}
          onChange={date => {
            if (date) {
              row.value = hasTime ? date.format() : date.format(queryDateFormat);
            } else {
              row.value = getFieldDefaultQueryValue(row.field);
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

interface RangeValueEditorProps extends QueryBuilderRowValueProps {
  component: React.ReactElement<QueryBuilderRowValueProps>;
}

const QueryBuilderValueRangeEditor = ({ component, onChange, row }: RangeValueEditorProps) => {
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
