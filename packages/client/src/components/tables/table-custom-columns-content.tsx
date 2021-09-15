import {
  IconButton, Menu, MenuItem, MenuItemProps, Table,
  TableBody, TableCell, TableHead, TableProps, TableRow, TableRowProps, Typography,
} from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import clsx from 'clsx';
import {
  getFullyQualifiedColumnName,
  getFullyQualifiedColumnDisplayName,
  CustomColumnConfig,
  ColumnInfo,
  ColumnType,
} from '@covid19-reports/shared';
import { OverrideType } from '../../utility/typescript-utils';
import useStyles from './table-custom-columns-content.styles';

interface TableCustomColumnsMenuItem {
  name: string;
  disabled?: boolean;
  hidden?: boolean;
  props?: MenuItemProps;
  callback: (row: any) => void;
}

interface TableCustomColumnsRow {
  [column: string]: any;
}

export type SortDirection = 'ASC' | 'DESC';

export interface TableColumn {
  type?: ColumnType;
  table?: string;
  name: string;
  displayName: string;
  fullyQualifiedName: string;
  config?: CustomColumnConfig;
}

export const ColumnInfoToTableColumns = (visibleColumns: ColumnInfo[]): TableColumn[] => {
  return visibleColumns.map((c: ColumnInfo) => {
    return {
      type: c.type,
      table: c.table,
      name: c.name,
      displayName: getFullyQualifiedColumnDisplayName(c),
      fullyQualifiedName: c?.table !== 'observation' ? getFullyQualifiedColumnName(c) : c.name,
      config: c.config,
    };
  });
};

export type TableRowOptions = {
  menuItems?: TableCustomColumnsMenuItem[] | ((row: any) => TableCustomColumnsMenuItem[]);
  renderCell?: (row: any, column: any) => void;
  rowProps?: Partial<TableRowProps> | ((row: any) => Partial<TableRowProps> | void | null | undefined);
};

type TableCustomColumnsContentProps = OverrideType<TableProps, {
  rows: TableCustomColumnsRow[];
  columns: TableColumn[];
  rowOptions?: TableRowOptions;
  idColumn: string | ((row: any) => string);
  sortable?: boolean;
  defaultSort?: { column: string; direction: SortDirection };
  onSortChange?: (column: TableColumn, direction: SortDirection) => void;
  noDataText?: string;
  title?: React.ReactNode;
}>;

interface RowMenuState {
  anchor: HTMLElement | null;
  row?: TableCustomColumnsRow;
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
    if (sortColumn?.fullyQualifiedName === column.fullyQualifiedName) {
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

  // eslint-disable-next-line promise/prefer-await-to-callbacks
  const handleMenuItemClick = (callback: (row: any) => void) => () => {
    const row = rowMenu.row;
    handleRowMenuClose();
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    callback(row);
  };
  
  const getEnumColumnValue = (c: TableColumn, uuid: string) => {
    if(c.type === ColumnType.Enum) {
      const enumConfig = c.config as { options: { id: string; label: string}[] };
      const selectedOption = enumConfig.options.find(option => option.id == uuid); 
      return selectedOption?.label;
    }
    return null;
  }
  
  const renderCell = (row: any, column: TableColumn) => {
    return (column.type === ColumnType.Enum ? getEnumColumnValue(column, row[column.fullyQualifiedName]) : row[column.fullyQualifiedName]);
  }

  const getRowId = (row: any) => { return (typeof idColumn === 'function' ? idColumn(row) : row[idColumn] as string); };
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
                key={column.fullyQualifiedName}
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
                <TableCell key={`${column.fullyQualifiedName}-${getRowId(row)}`}>
                  {rowOptions?.renderCell ? rowOptions?.renderCell(row, column) : renderCell(row, column)}
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
              <TableCell colSpan={5}>
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
