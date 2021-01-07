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
      // it seems like this should work as:  component="div"
      //   maybe a bug in material-ui's typescript types, moving on for now
      component={({ children }: { children?: React.ReactNode }) => <div>{children}</div>}
      ActionsComponent={props.ActionsComponent ?? TablePaginationActions}
    />
  );
};
