import {
  Button,
  TableBody, TableCell, TableHead, TableProps, TableRow,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import { OverrideType } from '../../utility/typescript-utils';
import useStyles from './table-custom-columns-content.styles';

type TableCustomColumnsContentProps = OverrideType<TableProps, {
  rows: {[columnName: string]: any}[]
  columns: {
    name: string
    displayName: string
  }[]
  rowOptions?: {
    showEditButton?: boolean
    showDeleteButton?: boolean
    onEditButtonClick?: (row: any) => void
    onDeleteButtonClick?: (row: any) => void
  }
}>;

export const TableCustomColumnsContent = (props: TableCustomColumnsContentProps) => {
  const classes = useStyles();

  const {
    rows, columns, rowOptions,
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
          <TableRow key={`${row.edipi}`}>
            {columns.map(column => (
              <TableCell key={`${column.name}-${row.edipi}`}>
                {row[column.name]}
              </TableCell>
            ))}

            {showActions() && (
              <TableCell className={classes.tableButtons}>
                <Button
                  className={classes.editRosterEntryButton}
                  variant="outlined"
                  onClick={() => rowOptions?.onEditButtonClick?.(row)}
                >
                  <EditIcon />
                </Button>
                <Button
                  className={classes.deleteRosterEntryButton}
                  variant="outlined"
                  onClick={() => rowOptions?.onDeleteButtonClick?.(row)}
                >
                  <DeleteIcon />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};
