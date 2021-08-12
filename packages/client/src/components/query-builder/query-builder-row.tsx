import {
  Grid,
  IconButton,
} from '@material-ui/core';
import React from 'react';
import {
  QueryOp,
  QueryValueScalarType,
  QueryValueType,
} from '@covid19-reports/shared';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {
  getFieldDefaultQueryOp,
  getFieldDefaultQueryValue,
  getFieldQueryOpDesc,
  isArrayOp,
  QueryField,
  QueryRow,
} from '../../utility/query-builder-utils';
import { QueryBuilderFieldSelect } from './query-builder-field-select';
import { QueryBuilderOpSelect } from './query-builder-op-select';
import useStyles from './query-builder-row.styles';
import { QueryBuilderValueEditor } from './query-builder-value-editor';

export type QueryBuilderRowProps = {
  availableFields: QueryField[];
  onChange: (row: QueryRow) => void;
  onRemoveClick: (row: QueryRow) => void;
  row: QueryRow;
};

export const QueryBuilderRow = (props: QueryBuilderRowProps) => {
  const { availableFields, onChange, onRemoveClick, row } = props;

  const classes = useStyles();
  const ops = getFieldQueryOpDesc(row.field);

  const getNewFieldValue = (newField: QueryField, newOp: QueryOp): QueryValueType => {
    if (row.field.enumItems || newField.enumItems) {
      return getFieldDefaultQueryValue(newField);
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

    return getFieldDefaultQueryValue(newField);
  };

  const handleRemoveClick = () => {
    onRemoveClick(row);
  };

  return (
    <>
      <Grid item xs={3}>
        <QueryBuilderFieldSelect
          fields={[row.field, ...availableFields].filter(Boolean) as QueryField[]}
          onChange={field => {
            const newOps = getFieldQueryOpDesc(field);
            const op = (row.op in newOps) ? row.op : getFieldDefaultQueryOp(field);
            onChange({
              field,
              op,
              value: getNewFieldValue(field, op),
              expression: '',
              expressionEnabled: false,
            });
          }}
        />
      </Grid>

      {ops && (
        <Grid item xs={2}>
          <QueryBuilderOpSelect
            onChange={op => {
              onChange({
                field: row.field,
                op,
                value: getNewFieldValue(row.field, op),
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
        <QueryBuilderValueEditor onChange={onChange} row={row} />
      </Grid>

      <IconButton
        className={classes.removeRowButton}
        onClick={handleRemoveClick}
      >
        <HighlightOffIcon />
      </IconButton>
    </>
  );
};
