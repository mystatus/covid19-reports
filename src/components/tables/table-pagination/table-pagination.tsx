import React from 'react';
import {
  TablePagination as MuiTablePagination,
  TablePaginationProps as MuiTablePaginationProps,
} from '@material-ui/core';
import { TablePaginationActions } from './table-pagination-actions';

export const TablePagination = (props: MuiTablePaginationProps) => {
  return (
    <MuiTablePagination
      {...props}
      ActionsComponent={props.ActionsComponent ?? TablePaginationActions}
    />
  );
};
