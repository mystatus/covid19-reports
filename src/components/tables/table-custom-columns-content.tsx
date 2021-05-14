import {
  IconButton, Menu, MenuItem, MenuItemProps, Table,
  TableBody, TableCell, TableHead, TableProps, TableRow, TableRowProps, Typography,
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
  disabled?: boolean,
  hidden?: boolean,
  props?: MenuItemProps,
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
    menuItems?: TableCustomColumnsMenuItem[] | ((row: any) => TableCustomColumnsMenuItem[])
    renderCell?: (row: any, column: any) => void
    rowProps?: Partial<TableRowProps> | ((row: any) => Partial<TableRowProps> | void | null | undefined)
  }
  idColumn: string | ((row: any) => string)
  sortable?: boolean
  defaultSort?: { column: string, direction: SortDirection }
  onSortChange?: (column: TableColumn, direction: SortDirection) => void
  noDataText?: string
  title?: React.ReactNode
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
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(props.defaultSort?.direction ?? 'ASC');

  const scrollRef = React.createRef<HTMLDivElement>();


  const {
    rows, columns, defaultSort, rowOptions, idColumn, noDataText, sortable, title, onSortChange,
  } = props;

  useEffect(() => {
    if (!sortColumn && defaultSort) {
      setSortColumn(defaultSort?.column ? columns.find(column => column.name === defaultSort?.column) : undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, defaultSort]);

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

  const getRowId = (row: any) => (typeof idColumn === 'function' ? idColumn(row) : row[idColumn] as string);
  const getRowProps = (row: any) => (typeof rowOptions?.rowProps === 'function' ? rowOptions?.rowProps?.(row) : rowOptions?.rowProps);
  const getRowActions = (row: any) => (typeof rowOptions?.menuItems === 'function' ? rowOptions?.menuItems?.(row) : rowOptions?.menuItems) || [];
  const showRowActions = (row: any) => Boolean(getRowActions(row)?.length);
  const showActions = Boolean(rowMenu.row) && rows.some(showRowActions);

  useEffect(() => {
    updateScroll();
  }, [updateScroll]);

  return (
    <div className={classes.tableScroll} ref={scrollRef} onScroll={updateScroll}>
      <Table>
        <TableHead>
          {title && (
            <TableRow className={classes.tableTitle}>
              <TableCell colSpan={columns.length + 2}>
                <h2>{title}</h2>
              </TableCell>
            </TableRow>
          )}
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
                      sortDirection === 'ASC' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
                    )}
                  </div>
                </div>
              </TableCell>
            ))}

            <TableCell className={showActions ? classes.iconHeader : classes.rightShadowCell} />
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map(row => (
            <TableRow key={getRowId(row)} {...getRowProps(row)}>
              <TableCell className={classes.leftShadowCell}>
                {leftShadowVisible && (
                  <div className={classes.leftShadow} />
                )}
              </TableCell>
              {columns.map(column => (
                <TableCell key={`${column.name}-${getRowId(row)}`}>
                  {rowOptions?.renderCell?.(row, column) || row[column.name]}
                </TableCell>
              ))}


              {showRowActions(row) ? (
                <TableCell className={classes.iconCell}>
                  {rightShadowVisible && (
                    <div className={classes.iconShadow} />
                  )}
                  <IconButton
                    aria-label="workspace actions"
                    aria-controls={`row-${getRowId(row)}-menu`}
                    aria-haspopup="true"
                    onClick={handleRowMenuClick(row)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              ) : (
                <TableCell className={classes.rightShadowCell}>
                  {rightShadowVisible && (
                    <div className={classes.rightShadow} />
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
          {showActions && (
            <Menu
              id="row-menu"
              anchorEl={rowMenu.anchor}
              keepMounted
              open={Boolean(rowMenu.row)}
              onClose={handleRowMenuClose}
            >
              {getRowActions(rowMenu.row).filter(menuItem => !menuItem.hidden).map(menuItem => (
                <MenuItem
                  disabled={menuItem.disabled}
                  onClick={handleMenuItemClick(menuItem.callback)}
                  key={menuItem.name}
                  {...(menuItem.props as any ?? {})}
                >
                  {menuItem.name}
                </MenuItem>
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
