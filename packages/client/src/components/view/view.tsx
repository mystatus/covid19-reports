import React, {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  Menu,
  MenuItem,
  Paper,
  TableContainer,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import FilterListIcon from '@material-ui/icons/FilterList';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import deepEquals from 'fast-deep-equal';
import {
  ColumnInfo,
  ColumnType,
  FilterConfig,
  FilterEntityType,
  PaginationParams,
  SavedFilterSerialized,
} from '@covid19-reports/shared';
import useEffectDebounced from '../../hooks/use-effect-debounced';
import { getNewPageIndex } from '../../utility/table';
import {
  SortDirection,
  TableColumn,
  TableCustomColumnsContent,
} from '../tables/table-custom-columns-content';
import { TablePagination } from '../tables/table-pagination/table-pagination';
import useStyles from '../pages/roster-page/roster-page.styles';
import {
  ApiEnumColumnConfig,
  ApiPaginated,
} from '../../models/api-response';
import { UnitSelector } from '../../selectors/unit.selector';
import { QueryBuilder } from '../query-builder/query-builder';
import { formatErrorMessage } from '../../utility/errors';
import { Modal } from '../../actions/modal.actions';
import { UserSelector } from '../../selectors/user.selector';
import usePersistedState from '../../hooks/use-persisted-state';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { useAppSelector } from '../../hooks/use-app-selector';
import { Unit } from '../../actions/unit.actions';
import { ClientPromise } from '../../utility/client-utils';
import { filterConfigToQueryRows, QueryField, QueryFieldEnumItem, QueryRow, queryRowsToFilterConfig } from '../../utility/query-builder-utils';
import { SavedFilterClient } from '../../client/saved-filter.client';
import { SaveNewFilterDialog } from '../pages/roster-page/save-new-filter-dialog';

// const unitColumn: ColumnInfo = {
//   name: 'unit',
//   displayName: 'Unit',
//   custom: false,
//   phi: false,
//   pii: false,
//   type: ColumnType.String,
//   updatable: true,
//   required: false,
//   config: {},
// };

type ViewProps<T> = {
  allowedColumns: (orgId: number) => Promise<ColumnInfo[]>;
  entityType: FilterEntityType;
  maxTableColumns?: number;
  query: (orgId: number, params: PaginationParams, filterConfig?: FilterConfig) => ClientPromise<ApiPaginated<T>>;
};

const initialResponse = function <T>() {
  return {
    rows: [],
    totalRowsCount: 0,
  } as ApiPaginated<T>;
};

const initialPaginationParams = {
  limit: '10',
  page: '0',
};

type FilterId = SavedFilterSerialized['id'];
const customFilterId = -1;
const noFilterId = -2;

export default function View<T>({ allowedColumns, entityType, maxTableColumns = 5, query }: ViewProps<T>) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const units = useAppSelector(UnitSelector.all);
  const { id: orgId } = useAppSelector(UserSelector.org)!;
  const [unitNameMap, setUnitNameMap] = useState<{ [key: string]: string }>({});
  const [visibleColumns, setVisibleColumns] = usePersistedState<ColumnInfo[]>(`${entityType}VisibleColumns`, []);
  const [columnInfos, setColumnInfos] = useState<ColumnInfo[]>([]);
  const [visibleColumnsMenuOpen, setVisibleColumnsMenuOpen] = useState(false);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const visibleColumnsButtonRef = useRef<HTMLDivElement>(null);
  const queryPromiseRef = useRef<ClientPromise<ApiPaginated<T>>>();

  const [{ rows, totalRowsCount }, setResponse] = useState<ApiPaginated<T>>(initialResponse<T>());
  const [paginationParams, setPaginationParams] = usePersistedState<PaginationParams>(`${entityType}Pagination`, initialPaginationParams);


  const [savedFilters, setSavedFilters] = useState<SavedFilterSerialized[]>([]);
  const [selectedFilterId, setSelectedFilterId] = usePersistedState<FilterId>('selectedFilterId', noFilterId);
  const [selectFilterMenuOpen, setSelectFilterMenuOpen] = useState(false);
  const [filterEditorOpen, setFilterEditorOpen] = usePersistedState('rosterFilterEditorOpen', false);
  const [filterQueryRows, setFilterQueryRows] = usePersistedState<QueryRow[]>('rosterFilterQueryRows', []);
  const [saveNewFilterDialogOpen, setSaveNewFilterDialogOpen] = useState(false);
  const selectFilterButtonRef = useRef<HTMLButtonElement>(null);

  const queryBuilderFields = useMemo((): QueryField[] => {
    return columnInfos.map(column => {
      let type = column.type as unknown as ColumnType;
      let enumItems: QueryFieldEnumItem[] | undefined;

      if (column.name === 'unit') {
        type = ColumnType.Enum;
        enumItems = units.map(({ id, name }) => ({ label: name, value: id }));
      } else if (column.type === ColumnType.Enum) {
        const options = (column.config as ApiEnumColumnConfig)?.options?.slice() ?? [];
        options.unshift({ id: '', label: '' });
        enumItems = options.map(({ id, label }) => ({ label, value: id }));
      }

      return {
        type,
        enumItems,
        displayName: column.displayName,
        name: column.name,
      };
    });
  }, [columnInfos, units]);

  const fetchEntities = useCallback(async () => {
    if (!applyingFilters) {
      setApplyingFilters(true);
      setResponse(initialResponse<T>());
    }

    try {
      queryPromiseRef.current?.abort?.();

      const filterConfig = queryRowsToFilterConfig(filterQueryRows);
      queryPromiseRef.current = query(orgId, paginationParams, filterConfig);
      const promise = queryPromiseRef.current;
      const response = await promise;

      if (promise === queryPromiseRef.current) {
        queryPromiseRef.current = undefined;
        setResponse(response);
      }
    } catch (error) {
      void dispatch(Modal.alert('Error', formatErrorMessage(error, 'Error Applying Filters')));
    } finally {
      setApplyingFilters(false);
    }

    return () => {
      queryPromiseRef.current?.abort?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, paginationParams, orgId, query, filterQueryRows]);

  const fetchSavedFilters = useCallback(async () => {
    try {
      const filters = await SavedFilterClient.getSavedFilters(orgId, { entityType });
      setSavedFilters(filters);

      const selectedFilterFound = (
        selectedFilterId === noFilterId
        || selectedFilterId === customFilterId
        || filters.some(x => x.id === selectedFilterId)
      );

      if (!selectedFilterFound) {
        setSelectedFilterId(noFilterId);
      }
    } catch (error) {
      void dispatch(Modal.alert('Get Saved Filters', formatErrorMessage(error, 'Failed to get saved filters')));
    }
  }, [dispatch, entityType, orgId, setSavedFilters, selectedFilterId, setSelectedFilterId]);

  useEffectDebounced(() => {
    void dispatch(Unit.fetch(orgId));
  }, [dispatch, orgId]);

  useEffectDebounced(() => {
    void fetchEntities();
  }, [fetchEntities]);

  useEffectDebounced(() => {
    void fetchSavedFilters();
  }, [fetchSavedFilters]);

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

  useEffect(() => {
    const unitNames: { [key: string]: string } = {};
    for (const unit of units) {
      unitNames[unit.id] = unit.name;
    }
    setUnitNameMap(unitNames);
  }, [units]);

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

  const getSelectedSavedFilter = useCallback(() => {
    return savedFilters.find(x => x.id === selectedFilterId);
  }, [savedFilters, selectedFilterId]);

  const handleChangeFilterQueryRows = useCallback((queryRows: QueryRow[]) => {
    setFilterQueryRows(queryRows);
  }, [setFilterQueryRows]);

  useEffect(() => {
    const savedFilter = getSelectedSavedFilter();
    if (savedFilter) {
      const queryRowsNew = filterConfigToQueryRows(savedFilter.config, queryBuilderFields);
      setFilterQueryRows(queryRowsNew);
    } else if (selectedFilterId === noFilterId) {
      setFilterQueryRows([]);
    }
  }, [queryBuilderFields, getSelectedSavedFilter, selectedFilterId, setFilterQueryRows]);

  const handleSortChanged = useCallback((column: TableColumn, direction: SortDirection) => {
    setPaginationParams(prev => ({
      ...prev,
      orderBy: column.name,
      sortDirection: direction,
    }));
  }, [setPaginationParams]);

  const handleChangePage = useCallback((event: MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPaginationParams(prev => ({
      ...prev,
      page: `${page}`,
    }));
  }, [setPaginationParams]);

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const page = getNewPageIndex(+paginationParams.limit, +paginationParams.page, +event.target.value);
    setPaginationParams({
      ...paginationParams,
      limit: event.target.value,
      page: `${page}`,
    });
  };

  const getCellDisplayValue = (entity: T & Record<string, unknown>, column: ColumnInfo) => {
    const value: any = entity[column.name];
    if (value == null) {
      return '';
    }
    if (column.name === 'unit') {
      return unitNameMap[value as string];
    }
    switch (column.type) {
      case ColumnType.Date:
        return new Date(value as string).toLocaleDateString();
      case ColumnType.DateTime:
        return new Date(value as string).toUTCString();
      case ColumnType.Boolean:
        return value ? 'Yes' : 'No';
      default:
        return value;
    }
  };

  const getFilterButtonText = () => {
    switch (selectedFilterId) {
      case noFilterId:
        return 'No Filter';
      case customFilterId:
        return 'Custom';
      default:
        return getSelectedSavedFilter()?.name;
    }
  };

  const selectFilter = (filterId: FilterId) => {
    setSelectedFilterId(filterId);
    setSelectFilterMenuOpen(false);

    if (filterId === customFilterId) {
      setFilterEditorOpen(true);
    }
  };

  const handleFilterSaveClick = async (queryRows: QueryRow[]) => {
    const savedFilter = getSelectedSavedFilter();
    if (!savedFilter) {
      setSaveNewFilterDialogOpen(true);
      return;
    }

    const result = await dispatch(Modal.confirm('Overwrite Saved Filter', 'Are you sure?', {
      confirmText: 'Overwrite',
    }));

    if (!result?.button?.value) {
      return;
    }

    await SavedFilterClient.updateSavedFilter(orgId, savedFilter.id, {
      config: queryRowsToFilterConfig(queryRows),
    });

    await fetchSavedFilters();
  };

  const handleFilterDeleteClick = async () => {
    const result = await dispatch(Modal.confirm('Delete Saved Filter', 'Are you sure?', {
      destructive: true,
      confirmText: 'Delete',
    }));

    if (!result?.button?.value) {
      return;
    }

    await SavedFilterClient.deleteSavedFilter(orgId, selectedFilterId);

    await fetchSavedFilters();
  };

  const isSelectedFilterSaved = () => {
    return (selectedFilterId !== noFilterId && selectedFilterId !== customFilterId);
  };

  const filterHasChanges = useMemo(() => {
    if (selectedFilterId === customFilterId) {
      return true;
    }

    const savedFilter = getSelectedSavedFilter();
    if (!savedFilter) {
      return false;
    }

    const savedFilterQueryRows = filterConfigToQueryRows(savedFilter.config, queryBuilderFields);
    return !deepEquals(savedFilterQueryRows, filterQueryRows);
  }, [filterQueryRows, getSelectedSavedFilter, queryBuilderFields, selectedFilterId]);

  const handleSaveNewFilterConfirm = async (name: string) => {
    let savedFilter: SavedFilterSerialized;
    try {
      savedFilter = await SavedFilterClient.addSavedFilter(orgId, {
        name,
        entityType: FilterEntityType.RosterEntry,
        config: queryRowsToFilterConfig(filterQueryRows),
      });
    } catch (err) {
      void dispatch(Modal.alert('Save New Filter', `Unable to save filter: ${formatErrorMessage(err)}`));
      return;
    }

    await fetchSavedFilters();
    setSelectedFilterId(savedFilter.id);
    setSaveNewFilterDialogOpen(false);
  };

  return (
    <TableContainer component={Paper}>
      <Box className={classes.tableHeader}>
        <Box>
          <Button
            aria-label="Select Filter"
            className={classes.tableHeaderButtonSelect}
            onClick={() => setSelectFilterMenuOpen(!selectFilterMenuOpen)}
            size="small"
            startIcon={<FilterListIcon />}
            endIcon={selectFilterMenuOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            variant="outlined"
            ref={selectFilterButtonRef}
          >
            <span className={classes.filterButtonText}>
              {getFilterButtonText()}
            </span>
          </Button>

          <Menu
            anchorEl={selectFilterButtonRef.current}
            keepMounted
            open={selectFilterMenuOpen}
            onClose={() => setSelectFilterMenuOpen(false)}
          >
            <MenuItem onClick={() => selectFilter(noFilterId)}>
              No Filter
            </MenuItem>

            <MenuItem onClick={() => selectFilter(customFilterId)}>
              Custom
            </MenuItem>

            {(savedFilters.length > 0) && (
              <Box marginY={1}>
                <Divider />
              </Box>
            )}

            {savedFilters.map(savedFilter => (
              <MenuItem
                key={savedFilter.id}
                onClick={() => selectFilter(savedFilter.id)}
              >
                {savedFilter.name}
              </MenuItem>
            ))}
          </Menu>

          {selectedFilterId !== noFilterId && (
            <Button
              aria-label="Toggle Filter Editor"
              className={classes.tableHeaderButton}
              onClick={() => setFilterEditorOpen(!filterEditorOpen)}
              size="small"
              variant="outlined"
            >
              {`${filterEditorOpen ? 'Hide' : 'Show'} Filter Editor`}
            </Button>
          )}
        </Box>

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
        </Box>
      </Box>

      <Menu
        id="user-more-menu"
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
                      setVisibleColumns(columnInfos.filter(col => col.name === column.name || visibleColumns.some(({ name }) => name === col.name)));
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
      {/* <QueryBuilder
        fields={columnInfos
          .map(column => {
            let items: QueryFieldPickListItem[] | undefined;
            if (column.name === 'unit') {
              items = units.map(({ id, name }) => ({ label: name, value: id }));
            } else if (column.type === ColumnType.Enum) {
              const options = (column.config as ApiEnumColumnConfig)?.options?.slice() ?? [];
              options.unshift({ id: '', label: '' });
              items = options.map(({ id, label }) => ({ label, value: id }));
            } else {
              items = undefined;
            }
            return {
              items,
              displayName: column.displayName,
              name: column.name,
              type: column.type as unknown as ColumnType,
            };
          })}
        onChange={setQueryFilterState}
        open={filtersOpen}
        persistKey={`${entityType}Query`}
      /> */}
      <Collapse in={selectedFilterId !== noFilterId && filterEditorOpen}>
        <QueryBuilder
          queryFields={queryBuilderFields}
          queryRows={filterQueryRows}
          onChangeQueryRows={handleChangeFilterQueryRows}
          onSaveClick={handleFilterSaveClick}
          onSaveAsClick={() => setSaveNewFilterDialogOpen(true)}
          onDeleteClick={handleFilterDeleteClick}
          isSaved={isSelectedFilterSaved()}
          hasChanges={filterHasChanges}
        />
      </Collapse>
      <div className={classes.tableWrapper}>
        <TableCustomColumnsContent
          rows={rows}
          columns={visibleColumns}
          sortable
          defaultSort={paginationParams.orderBy ? { column: paginationParams.orderBy, direction: paginationParams.sortDirection ?? 'ASC' } : undefined}
          onSortChange={handleSortChanged}
          idColumn="id"
          noDataText={applyingFilters ? 'Searching...' : 'No Data'}
          rowOptions={{
            // menuItems: canManageRoster ? [{
            //   name: 'Edit Entry',
            //   callback: editEntryClicked,
            // }, {
            //   name: 'Delete Entry',
            //   callback: deleteEntryClicked,
            // }] : [],
            renderCell: getCellDisplayValue,
          }}
        />
        <TablePagination
          className={classes.pagination}
          count={totalRowsCount}
          page={+paginationParams.page}
          rowsPerPage={+paginationParams.limit}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      <SaveNewFilterDialog
        open={saveNewFilterDialogOpen}
        onSave={handleSaveNewFilterConfirm}
        onCancel={() => setSaveNewFilterDialogOpen(false)}
      />
    </TableContainer>
  );
}
