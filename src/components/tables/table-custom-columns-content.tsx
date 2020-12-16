import {
  IconButton, Menu, MenuItem, Table,
  TableBody, TableCell, TableHead, TableProps, TableRow, Typography,
} from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import clsx from 'clsx';
import { OverrideType } from '../../utility/typescript-utils';
import useStyles from './table-custom-columns-content.styles';

interface TableCustomColumnsMenuItem {
  name: string,
  callback: (row: any) => void,
}

interface TableCustomColumnsRow {
  [column: string]: any
}

export type SortDirection = 'ASC' | 'DESC';

export interface TableColumn {
  name: string,
  displayName: string,
}

type TableCustomColumnsContentProps = OverrideType<TableProps, {
  rows: TableCustomColumnsRow[]
  columns: TableColumn[]
  rowOptions?: {
    menuItems?: TableCustomColumnsMenuItem[]
    renderCell?: (row: any, column: any) => void
  }
  idColumn: string
  sortable?: boolean
  onSortChange?: (column: TableColumn, direction: SortDirection) => void
  noDataText?: string
}>;

interface RowMenuState {
  anchor: HTMLElement | null,
  row?: TableCustomColumnsRow,
}

export const TableCustomColumnsContent = (props: TableCustomColumnsContentProps) => {
  const classes = useStyles();
  const [rowMenu, setRowMenu] = React.useState<RowMenuState>({ anchor: null });

  const [leftShadowVisible, setLeftShadowVisible] = React.useState(false);
  const [rightShadowVisible, setRightShadowVisible] = React.useState(false);
  const [sortColumn, setSortColumn] = React.useState<TableColumn | undefined>();
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('ASC');

  const scrollRef = React.createRef<HTMLDivElement>();

  const {
    rows, columns, rowOptions, idColumn, noDataText, sortable, onSortChange,
  } = props;

  const showActions = () => {
    return Boolean(rowOptions?.menuItems?.length);
  };

  const columnClicked = (column: TableColumn) => () => {
    if (!sortable) {
      return;
    }
    let newSortDirection: SortDirection = 'ASC';
    if (sortColumn === column) {
      newSortDirection = sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      setSortColumn(column);
    }
    setSortDirection(newSortDirection);
    if (onSortChange) {
      onSortChange(column, newSortDirection);
    }
  };

  const updateScroll = useCallback(() => {
    if (!scrollRef.current) {
      return;
    }
    setRightShadowVisible((scrollRef.current.scrollWidth - scrollRef.current.scrollLeft - 1) > scrollRef.current.clientWidth);
    setLeftShadowVisible(scrollRef.current.scrollLeft > 1);
  }, [scrollRef]);

  const handleRowMenuClick = (row: TableCustomColumnsRow) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setRowMenu({ anchor: event.currentTarget, row });
  };

  const handleRowMenuClose = () => {
    setRowMenu({ anchor: null });
  };

  const handleMenuItemClick = (callback: (row: any) => void) => () => {
    const row = rowMenu.row;
    handleRowMenuClose();
    callback(row);
  };

  useEffect(() => {
    updateScroll();
  }, [updateScroll]);

  return (
    <div className={classes.tableScroll} ref={scrollRef} onScroll={updateScroll}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.leftShadowCell} />
            {columns.map(column => (
              <TableCell
                onClick={columnClicked(column)}
                key={column.name}
                className={clsx({
                  [classes.sortableHeader]: sortable,
                })}
              >
                <div>
                  <div>{column.displayName}</div>
                  <div>
                    {sortColumn === column && (
                      sortDirection === 'ASC' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
                    )}
                  </div>
                </div>
              </TableCell>
            ))}

            {showActions() && (
              <TableCell className={classes.iconHeader} />
            )}
            {!showActions() && (
              <TableCell className={classes.rightShadowCell} />
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map(row => (
            <TableRow key={`${row[idColumn]}`}>
              <TableCell className={classes.leftShadowCell}>
                {leftShadowVisible && (
                  <div className={classes.leftShadow} />
                )}
              </TableCell>
              {columns.map(column => (
                <TableCell key={`${column.name}-${row[idColumn]}`}>
                  {rowOptions?.renderCell?.(row, column) || row[column.name]}
                </TableCell>
              ))}


              {showActions() && (
                <TableCell className={classes.iconCell}>
                  {rightShadowVisible && (
                    <div className={classes.iconShadow} />
                  )}
                  <IconButton
                    aria-label="workspace actions"
                    aria-controls={`row-${row[idColumn]}-menu`}
                    aria-haspopup="true"
                    onClick={handleRowMenuClick(row)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              )}
              {!showActions() && (
                <TableCell className={classes.rightShadowCell}>
                  {rightShadowVisible && (
                    <div className={classes.rightShadow} />
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
          {showActions() && (
            <Menu
              id="row-menu"
              anchorEl={rowMenu.anchor}
              keepMounted
              open={Boolean(rowMenu.row)}
              onClose={handleRowMenuClose}
            >
              {rowOptions!.menuItems!.map(menuItem => (
                <MenuItem onClick={handleMenuItemClick(menuItem.callback)}>{menuItem.name}</MenuItem>
              ))}
            </Menu>
          )}

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
      </Table>
    </div>
  );
};
