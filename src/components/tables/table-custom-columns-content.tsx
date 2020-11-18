import {
  Button,
  TableBody, TableCell, TableHead, TableProps, TableRow, Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import { OverrideType } from '../../utility/typescript-utils';
import useStyles from './table-custom-columns-content.styles';

type TableCustomColumnsContentProps = OverrideType<TableProps, {
  rows: {[columnName: string]: any}[]
  columns: any[]
  rowOptions?: {
    showEditButton?: boolean
    showDeleteButton?: boolean
    onEditButtonClick?: (row: any) => void
    onDeleteButtonClick?: (row: any) => void
    renderCell?: (row: any, column: any) => void
  }
  idColumn: string
  noDataText?: string
}>;

export const TableCustomColumnsContent = (props: TableCustomColumnsContentProps) => {
  const classes = useStyles();

  const {
    rows, columns, rowOptions, idColumn, noDataText,
  } = props;

  const showActions = () => {
    return (rowOptions?.showEditButton || rowOptions?.showDeleteButton);
  };

  return (
    <>
      <TableHead>
        <TableRow>
          {columns.map(column => (
            <TableCell key={column.name}>{column.displayName}</TableCell>
          ))}

          {showActions() && (
            <TableCell />
          )}
        </TableRow>
      </TableHead>

      <TableBody>
        {rows.map(row => (
          <TableRow key={`${row[idColumn]}`}>
            {columns.map(column => (
              <TableCell key={`${column.name}-${row[idColumn]}`}>
                {rowOptions?.renderCell?.(row, column) || row[column.name]}
              </TableCell>
            ))}

            {showActions() && (
              <TableCell className={classes.tableButtons}>
                <Button
                  className={classes.editButton}
                  variant="outlined"
                  onClick={() => rowOptions?.onEditButtonClick?.(row)}
                >
                  <EditIcon />
                </Button>
                <Button
                  className={classes.deleteButton}
                  variant="outlined"
                  onClick={() => rowOptions?.onDeleteButtonClick?.(row)}
                >
                  <DeleteIcon />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}

        {rows.length === 0 && (
          <TableRow>
            <TableCell>
              <Typography className={classes.noData} variant="h6">
                {noDataText ?? 'No Data'}
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );
};
