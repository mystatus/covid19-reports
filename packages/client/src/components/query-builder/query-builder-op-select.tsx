import { QueryOp } from '@covid19-reports/shared';
import { Select } from '@material-ui/core';
import React from 'react';
import { QueryOpsDesc } from '../../utility/query-builder-utils';

type QueryBuilderOpSelectProps = {
  onChange: (op: QueryOp) => void;
  value: QueryOp;
  ops: QueryOpsDesc;
};

export const QueryBuilderOpSelect = (props: QueryBuilderOpSelectProps) => {
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
