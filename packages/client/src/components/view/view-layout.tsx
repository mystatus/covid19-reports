import React, {
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
} from '@material-ui/core';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import {
  ColumnInfo,
  FilterEntityType,
  friendlyColumnValue,
  SortedQuery,
} from '@covid19-reports/shared';
import useEffectDebounced from '../../hooks/use-effect-debounced';
import {
  TableRowOptions,
} from '../tables/table-custom-columns-content';
import useStyles from '../pages/roster-page/roster-page.styles';
import { formatErrorMessage } from '../../utility/errors';
import { Modal } from '../../actions/modal.actions';
import { UserSelector } from '../../selectors/user.selector';
import usePersistedState from '../../hooks/use-persisted-state';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { useAppSelector } from '../../hooks/use-app-selector';

export type LayoutConfig = SortedQuery & {
  columns: ColumnInfo[];
  entityType: FilterEntityType;
  maxTableColumns?: number;
  name: string;
  visibleColumns: ColumnInfo[];
};

export type Layout = LayoutConfig & {
  rowOptions?: TableRowOptions;
  setSortedQuery: React.Dispatch<React.SetStateAction<SortedQuery>>;
};

export type ViewLayoutProps<K extends keyof typeof FilterEntityType> = {
  allowedColumns: (orgId: number) => Promise<ColumnInfo[]>;
  children: (layout: Layout, editor: JSX.Element) => JSX.Element;
  entityType: K extends 'Observation' ? FilterEntityType.Observation : FilterEntityType.RosterEntry;
  maxTableColumns?: number;
  name?: string;
  rowOptions?: TableRowOptions;
};

export const defaultRowOptions: TableRowOptions = {
  renderCell: friendlyColumnValue,
};

const defaultMaxTableColumns = 7;

export default function ViewLayout<E extends FilterEntityType>({
  allowedColumns,
  children,
  entityType,
  maxTableColumns = defaultMaxTableColumns,
  rowOptions = defaultRowOptions,
  ...restProps
}: ViewLayoutProps<E>) {
  const { name = entityType } = restProps;
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { id: orgId } = useAppSelector(UserSelector.org)!;
  const [visibleColumns, setVisibleColumns] = usePersistedState<ColumnInfo[]>(`${name}VisibleColumns`, []);
  const [columnInfos, setColumnInfos] = useState<ColumnInfo[]>([]);
  const [visibleColumnsMenuOpen, setVisibleColumnsMenuOpen] = useState(false);
  const visibleColumnsButtonRef = useRef<HTMLSpanElement>(null);
  const [sortedQuery, setSortedQuery] = usePersistedState<SortedQuery>(`${name}Sort`);

  useEffectDebounced(() => {
    if (!columnInfos.length) {
      void (async () => {
        try {
          const columns = await allowedColumns(orgId);
          // const unitColumnWithInfos = sortColumns([unitColumn, ...infos]);
          setColumnInfos(columns);

          if (visibleColumns.length === 0) {
            setVisibleColumns(columns.slice(0, maxTableColumns));
          }
        } catch (error) {
          void dispatch(Modal.alert('Error', formatErrorMessage(error, 'Failed to fetch the available Entity columns')));
        }
      })();
    }
  }, [allowedColumns, dispatch, orgId, columnInfos, maxTableColumns, setColumnInfos, setVisibleColumns, visibleColumns.length]);

  // const sortColumns = (columns: ColumnInfo[]) => {
  //   const columnPriority: Record<string, number> = {
  //     edipi: 1,
  //     unit: 4,
  //   };
  //   return columns.sort((a: ColumnInfo, b: ColumnInfo) => {
  //     const ap = (columnPriority[a.name] || columnPriority.default);
  //     const bp = (columnPriority[b.name] || columnPriority.default);
  //     return ap - bp;
  //   });
  // };

  return (
    <>
      {children({
        columns: columnInfos,
        entityType,
        name: name ?? entityType,
        rowOptions,
        visibleColumns,
        ...sortedQuery,
        setSortedQuery,
      }, (
        <Box>
          <Button
            aria-label="Visible columns"
            className={classes.tableHeaderButton}
            onClick={() => setVisibleColumnsMenuOpen(!visibleColumnsMenuOpen)}
            size="small"
            startIcon={<ViewWeekIcon />}
            variant="outlined"
          >
            <span ref={visibleColumnsButtonRef}>
              Columns
            </span>
          </Button>

          <Menu
            id="layout-visible-columns-menu"
            anchorEl={visibleColumnsButtonRef.current}
            keepMounted
            open={Boolean(visibleColumnsMenuOpen)}
            onClose={() => setVisibleColumnsMenuOpen(false)}
          >
            {columnInfos.map(column => (
              <MenuItem key={column.name} className={classes.columnItem}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      color="primary"
                      checked={visibleColumns.some(col => col.name === column.name)}
                      onChange={event => {
                        const { checked } = event.target;
                        if (checked) {
                          setVisibleColumns(columnInfos.filter(col => col.name === column.name || visibleColumns.some(({ name: n }) => n === col.name)));
                        } else {
                          setVisibleColumns([...visibleColumns.filter(col => col.name !== column.name)]);
                        }
                      }}
                    />
                  )}
                  label={column.displayName}
                />
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ))}
    </>
  );
}
