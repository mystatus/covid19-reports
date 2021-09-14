import { Select } from '@material-ui/core';
import React from 'react';
import { getFullyQualifiedColumnName } from '@covid19-reports/shared';
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
        <option key={getFullyQualifiedColumnName(field)} value={index}>
          {field.table ? `${field.displayName} (${field.table})` : field.displayName}
        </option>
      ))}
    </Select>
  );
};
