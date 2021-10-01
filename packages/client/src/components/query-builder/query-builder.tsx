import {
  Box,
  Button,
  Grid,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SaveIcon from '@material-ui/icons/Save';
import React, {
  useEffect,
  useMemo,
} from 'react';
import { getFullyQualifiedColumnName, QueryValueType } from '@covid19-reports/shared';
import useStyles from './query-builder.styles';
import {
  getFieldDefaultQueryOp,
  getFieldDefaultQueryValueForOp,
  opRequiresValue,
  ExpressionReference,
  QueryField,
  QueryRow,
} from '../../utility/query-builder-utils';
import { QueryBuilderRow } from './query-builder-row';

export interface QueryBuilderProps {
  queryFields: QueryField[];
  queryRows: QueryRow[];
  expressionRefsByType?: Map<QueryValueType, ExpressionReference[]>;
  onChangeQueryRows: (queryRows: QueryRow[]) => void;
  onSaveClick: (queryRows: QueryRow[]) => void;
  hasChanges: boolean;
  showAddCriteriaButton: boolean;
  showSaveButton: boolean;
}

export const QueryBuilder = (props: QueryBuilderProps) => {
  const {
    queryFields,
    queryRows,
    onChangeQueryRows,
    onSaveClick,
    hasChanges,
    expressionRefsByType,
    showAddCriteriaButton,
    showSaveButton,
  } = props;

  const classes = useStyles();

  // Don't allow duplicate fields.
  const availableFields = useMemo(() => {
    return queryFields.filter(field => {
      return !queryRows.some(row => getFullyQualifiedColumnName(row.field) === getFullyQualifiedColumnName(field));
    });
  }, [queryFields, queryRows]);

  const addRow = () => {
    if (availableFields.length <= 0) {
      return;
    }

    const field = availableFields[0];
    const op = getFieldDefaultQueryOp(field);
    const value = getFieldDefaultQueryValueForOp(field, op);

    onChangeQueryRows([
      ...queryRows,
      {
        field,
        op,
        value,
        expression: '',
        expressionEnabled: false,
        expressionRef: '',
      },
    ]);
  };

  const removeRow = (rowIndex: number) => () => {
    onChangeQueryRows(queryRows.filter((_, index) => index !== rowIndex));
  };

  const onRowChange = (rowIndex: number) => (row: QueryRow) => {
    const queryRowsNew = [...queryRows];

    queryRowsNew.splice(rowIndex, 1, row);
    onChangeQueryRows(queryRowsNew);
  };

  const hasValuesSet = () => {
    for (const queryRow of queryRows) {
      if (!opRequiresValue(queryRow.op) || (queryRow.value !== null && queryRow.value !== undefined && queryRow.value !== '')) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    onChangeQueryRows([...(queryRows ?? [])]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className={classes.root}>
      {(queryRows.length > 0) && (
        <Box className={classes.rowsContainer}>
          {queryRows.map((row, index) => (
            <Grid container spacing={2} key={getFullyQualifiedColumnName(row.field)}>
              <QueryBuilderRow
                availableFields={availableFields}
                onChange={onRowChange(index)}
                onRemoveClick={removeRow(index)}
                row={row}
                expressionRefsByType={expressionRefsByType}
              />
            </Grid>
          ))}
        </Box>
      )}

      {showAddCriteriaButton && (
        <Button
          aria-label="Add Criteria"
          className={classes.button}
          onClick={addRow}
          disabled={availableFields.length === 0}
          size="small"
          startIcon={<AddCircleIcon />}
          variant="outlined"
        >
          Add Criteria
        </Button>
      )}

      {showSaveButton && (
        <Button
          aria-label="Save"
          className={classes.button}
          onClick={() => onSaveClick(queryRows)}
          disabled={!hasChanges || !hasValuesSet()}
          size="small"
          startIcon={<SaveIcon />}
          variant="outlined"
        >
          Save
        </Button>
      )}
    </Box>
  );
};
