import {
  IconButton,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableProps,
  TableRow,
  TableRowProps,
  Typography,
} from '@material-ui/core';
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import clsx from 'clsx';
import _ from 'lodash';
import {
  getFullyQualifiedColumnName,
  getFullyQualifiedColumnDisplayName,
  ColumnInfo,
  friendlyColumnValue,
  EntityType,
} from '@covid19-reports/shared';
import { OverrideType } from '../../utility/typescript-utils';
import useStyles from './table-custom-columns-content.styles';
import { useAppSelector } from '../../hooks/use-app-selector';
import { EntityActionRegistrySelector } from '../../selectors/entity-action-registry.selector';
import { EntityTypeData } from '../../api/api-utils';
import {
  EntityActionColumnButtonItem,
  EntityActionColumnButtonItemBaked,
  EntityActionColumnItem,
} from '../../entity-actions/entity-action.types';
import { EntityActionColumnElement } from '../entity-action/entity-action-column-element';

interface TableCustomColumnsRow {
  [column: string]: any;
}

export type SortDirection = 'ASC' | 'DESC';

export type TableColumn = ColumnInfo & {
  fullyQualifiedName: string;
};

export type EntityTableRow<TEntityType extends EntityType> = EntityTypeData[TEntityType] & { id: number };

export function columnInfoToTableColumns(visibleColumns: ColumnInfo[]): TableColumn[] {
  return visibleColumns.map((column: ColumnInfo) => {
    return {
      ...column,
      displayName: getFullyQualifiedColumnDisplayName(column),
      fullyQualifiedName: column.action ? column.name : getFullyQualifiedColumnName(column),
    };
  });
}

export type TableRowOptions = {
  renderCell?: (row: any, column: TableColumn) => void;
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
  entityType?: EntityType;
}>;

interface RowMenuState {
  anchor: HTMLElement | null;
  row?: TableCustomColumnsRow;
}

export const TableCustomColumnsContent = (props: TableCustomColumnsContentProps) => {
  const {
    rows, columns, defaultSort, rowOptions, idColumn, noDataText, sortable, title, onSortChange, entityType,
  } = props;
  const classes = useStyles();

  const actions = useAppSelector(EntityActionRegistrySelector.all);

  const [rowMenu, setRowMenu] = useState<RowMenuState>({ anchor: null });
  const [leftShadowVisible, setLeftShadowVisible] = useState(false);
  const [rightShadowVisible, setRightShadowVisible] = useState(false);
  const [sortColumn, setSortColumn] = useState<TableColumn | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>(props.defaultSort?.direction ?? 'ASC');

  const scrollRef = createRef<HTMLDivElement>();

  const rowMenuActions = useMemo<(EntityActionColumnButtonItem | EntityActionColumnButtonItemBaked)[]>(() => {
    if (!entityType) {
      return [];
    }

    return _.chain(actions)
      .values()
      .filter(action => action.entityType === entityType)
      .filter(action => action.type === 'column-button-item' || action.type === 'column-button-item-baked')
      .value() as (EntityActionColumnButtonItem | EntityActionColumnButtonItemBaked)[];
  }, [actions, entityType]);

  useEffect(() => {
    if (!sortColumn && defaultSort) {
      setSortColumn(defaultSort?.column ? columns.find(column => column.name === defaultSort?.column) : undefined);
    }
  }, [columns, defaultSort, sortColumn]);

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

  const renderCell = (row: any, column: TableColumn) => {
    if (column.action) {
      return (
        <EntityActionColumnElement
          action={actions[column.name] as EntityActionColumnItem}
          columns={columns}
          rows={rows}
          row={row}
          renderAs="inline"
        />
      );
    }

    return friendlyColumnValue(row, column);
  };

  const getRowId = (row: any) => { return (typeof idColumn === 'function' ? idColumn(row) : row[idColumn] as string); };
  const getRowProps = (row: any) => (typeof rowOptions?.rowProps === 'function' ? rowOptions?.rowProps?.(row) : rowOptions?.rowProps);

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

            <TableCell className={rowMenuActions.length ? classes.iconHeader : classes.rightShadowCell} />
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

              {rowMenuActions.length ? (
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

                  <Menu
                    id="row-menu"
                    anchorEl={rowMenu.anchor}
                    open={row.id === rowMenu.row?.id}
                    onClose={handleRowMenuClose}
                  >
                    {rowMenuActions.map(action => (
                      <EntityActionColumnElement
                        key={action.id}
                        action={action}
                        columns={columns}
                        rows={rows}
                        row={row}
                        renderAs="menuItem"
                        onComplete={handleRowMenuClose}
                      />
                    ))}
                  </Menu>
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
