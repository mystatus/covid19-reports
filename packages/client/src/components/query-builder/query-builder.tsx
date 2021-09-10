import {
  Box,
  Button,
  Grid,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SaveIcon from '@material-ui/icons/Save';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import React, { useEffect } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { getFullyQualifiedColumnName, QueryOp } from '@covid19-reports/shared';
import useStyles from './query-builder.styles';
import {
  getFieldDefaultQueryOp,
  getFieldDefaultQueryValueForOp,
  opRequiresValue,
  QueryField,
  QueryRow,
} from '../../utility/query-builder-utils';
import { QueryBuilderRow } from './query-builder-row';

export interface QueryBuilderProps {
  queryFields: QueryField[];
  queryRows: QueryRow[];
  onChangeQueryRows: (queryRows: QueryRow[]) => void;
  onSaveClick: (queryRows: QueryRow[]) => void;
  onSaveAsClick: (queryRows: QueryRow[]) => void;
  onDeleteClick: () => void;
  isSaved: boolean;
  hasChanges: boolean;
}

export const QueryBuilder = (props: QueryBuilderProps) => {
  const {
    queryFields,
    queryRows,
    onChangeQueryRows,
    onSaveClick,
    onSaveAsClick,
    onDeleteClick,
    isSaved,
    hasChanges,
  } = props;

  const classes = useStyles();

  // Don't allow duplicate fields.
  const availableFields = queryFields.filter(field => !queryRows.some(row => getFullyQualifiedColumnName(row.field) === getFullyQualifiedColumnName(field)));

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
      if (!opRequiresValue(queryRow.op) || (queryRow.value !== null && queryRow.value !== undefined)) {
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
              />
            </Grid>
          ))}
        </Box>
      )}

      {(availableFields.length > 0) && (
        <Button
          aria-label="Add Criteria"
          className={classes.button}
          onClick={addRow}
          size="small"
          startIcon={<AddCircleIcon />}
          variant="outlined"
        >
          Add Criteria
        </Button>
      )}

      {hasValuesSet() && (
        <>
          <Button
            aria-label="Save"
            className={classes.button}
            onClick={() => onSaveClick(queryRows)}
            disabled={!hasChanges}
            size="small"
            startIcon={<SaveIcon />}
            variant="outlined"
          >
            Save
          </Button>

          {isSaved && (
            <Button
              aria-label="Save As"
              className={classes.button}
              onClick={() => onSaveAsClick(queryRows)}
              size="small"
              startIcon={<FileCopyIcon />}
              variant="outlined"
            >
              Save As
            </Button>
          )}
        </>
      )}

      {isSaved && (
        <Button
          aria-label="Delete"
          className={classes.deleteButton}
          onClick={() => onDeleteClick()}
          size="small"
          startIcon={<DeleteIcon />}
          variant="outlined"
        >
          Delete
        </Button>
      )}
    </Box>
  );
};
