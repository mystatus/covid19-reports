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
  Collapse,
  Divider,
  Menu,
  MenuItem,
  Paper,
  TableContainer,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import FilterListIcon from '@material-ui/icons/FilterList';
import deepEquals from 'fast-deep-equal';
import {
  ColumnType,
  FilterConfig,
  PaginatedQuery,
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
import { Layout } from './view-layout';

type ViewProps<T> = {
  layout: Layout;
  query: (orgId: number, params: PaginationParams, filterConfig?: FilterConfig) => ClientPromise<ApiPaginated<T>>;
};

type FilterId = SavedFilterSerialized['id'];
const customFilterId = -1;
const noFilterId = -2;

const initialPaginatedQuery = {
  limit: '10',
  page: '0',
};

const initialResponse = function <T>() {
  return {
    rows: [],
    totalRowsCount: 0,
  } as ApiPaginated<T>;
};

export default function View<T>({ layout, query }: ViewProps<T>) {
  const { columns, entityType, orderBy, rowOptions, sortDirection, visibleColumns } = layout;
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const units = useAppSelector(UnitSelector.all);
  const { id: orgId } = useAppSelector(UserSelector.org)!;
  // const [unitNameMap, setUnitNameMap] = useState<{ [key: string]: string }>({});
  const [applyingFilters, setApplyingFilters] = useState(false);
  const queryPromiseRef = useRef<ClientPromise<ApiPaginated<T>>>();

  const [{ rows, totalRowsCount }, setResponse] = useState<ApiPaginated<T>>(initialResponse<T>());
  const [paginatedQuery, setPaginatedQuery] = usePersistedState<PaginatedQuery>(`${layout.name}Pagination`, initialPaginatedQuery);

  const [savedFilters, setSavedFilters] = useState<SavedFilterSerialized[]>([]);
  const [selectedFilterId, setSelectedFilterId] = usePersistedState<FilterId>(`${layout.name}selectedFilterId`, noFilterId);
  const [selectFilterMenuOpen, setSelectFilterMenuOpen] = useState(false);
  const [filterEditorOpen, setFilterEditorOpen] = usePersistedState(`${layout.name}FilterEditorOpen`, false);
  const [filterQueryRows, setFilterQueryRows] = usePersistedState<QueryRow[]>(`${layout.name}FilterQueryRows`, []);
  const [saveNewFilterDialogOpen, setSaveNewFilterDialogOpen] = useState(false);
  const selectFilterButtonRef = useRef<HTMLButtonElement>(null);

  const queryBuilderFields = useMemo((): QueryField[] => {
    return columns.map(column => {
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
  }, [columns, units]);

  const fetchEntities = useCallback(async () => {
    if (!applyingFilters) {
      setApplyingFilters(true);
      setResponse(initialResponse<T>());
    }

    try {
      queryPromiseRef.current?.abort?.();

      const filterConfig = queryRowsToFilterConfig(filterQueryRows);
      queryPromiseRef.current = query(orgId, { ...paginatedQuery, orderBy, sortDirection }, filterConfig);
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
  }, [dispatch, paginatedQuery, orgId, query, filterQueryRows]);

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

  // useEffectDebounced(() => {
  //   setVisibleColumns(columns.filter(column => column.isVisible))
  // }, [columns, setVisibleColumns]);

  // useEffect(() => {
  //   const unitNames: { [key: string]: string } = {};
  //   for (const unit of units) {
  //     unitNames[unit.id] = unit.name;
  //   }
  //   setUnitNameMap(unitNames);
  // }, [units]);

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
    setPaginatedQuery(prev => ({
      ...prev,
      orderBy: column.name,
      sortDirection: direction,
    }));
  }, [setPaginatedQuery]);

  const handleChangePage = useCallback((event: MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPaginatedQuery(prev => ({
      ...prev,
      page: `${page}`,
    }));
  }, [setPaginatedQuery]);

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const page = getNewPageIndex(+paginatedQuery.limit, +paginatedQuery.page, +event.target.value);
    setPaginatedQuery({
      limit: event.target.value,
      page: `${page}`,
    });
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
        entityType,
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
      </Box>
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
          defaultSort={orderBy && sortDirection ? { column: orderBy, direction: sortDirection ?? 'ASC' } : undefined}
          onSortChange={handleSortChanged}
          idColumn="id"
          noDataText={applyingFilters ? 'Searching...' : 'No Data'}
          rowOptions={rowOptions}
        />
        <TablePagination
          className={classes.pagination}
          count={totalRowsCount}
          page={+paginatedQuery.page}
          rowsPerPage={+paginatedQuery.limit}
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
