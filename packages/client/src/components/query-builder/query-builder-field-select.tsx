import { Select } from '@material-ui/core';
import React from 'react';
import { QueryField } from '../../utility/query-builder-utils';

type QueryBuilderFieldSelectProps = {
  fields: QueryField[];
  onChange: (field: QueryField) => void;
};

export const QueryBuilderFieldSelect = (props: QueryBuilderFieldSelectProps) => {
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
