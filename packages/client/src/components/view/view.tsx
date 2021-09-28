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
  Paper,
  TableContainer,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import FilterListIcon from '@material-ui/icons/FilterList';
import deepEquals from 'fast-deep-equal';
import {
  getFullyQualifiedColumnName,
  getFullyQualifiedColumnDisplayName,
  ColumnInfo,
  ColumnType,
  GetEntitiesQuery,
  QueryValueType,
  SavedFilterSerialized,
} from '@covid19-reports/shared';
import useEffectDebounced from '../../hooks/use-effect-debounced';
import { getNewPageIndex } from '../../utility/table';
import {
  ColumnInfoToTableColumns,
  SortDirection,
  TableColumn,
  TableCustomColumnsContent,
} from '../tables/table-custom-columns-content';
import { TablePagination } from '../tables/table-pagination/table-pagination';
import useStyles from './view.styles';
import { ApiEnumColumnConfig } from '../../models/api-response';
import { UnitSelector } from '../../selectors/unit.selector';
import { QueryBuilder } from '../query-builder/query-builder';
import { formatErrorMessage } from '../../utility/errors';
import { Modal } from '../../actions/modal.actions';
import { UserSelector } from '../../selectors/user.selector';
import usePersistedState from '../../hooks/use-persisted-state';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { useAppSelector } from '../../hooks/use-app-selector';
import { Unit } from '../../actions/unit.actions';
import {
  filterConfigToQueryRows,
  ExpressionReference,
  QueryField,
  QueryFieldEnumItem,
  QueryRow,
  queryRowsToFilterConfig,
  getCleanedFilterConfig,
} from '../../utility/query-builder-utils';
import { SavedFilterClient } from '../../client/saved-filter.client';
import { SaveNewFilterDialog } from '../pages/roster-page/save-new-filter-dialog';
import { Layout } from './view-layout';
import { entityApi } from '../../api/entity.api';
import { SavedItemSelector } from './saved-item-selector';
import {
  customFilterId,
  FilterId,
  isCustomFilter,
  makeCustomFilter,
  makeNoFilter,
  noFilterId,
} from './view-utils';

export type ViewProps = {
  selectedFilterId?: FilterId;
  setSelectedFilterId: (filterId: FilterId) => void;
  idColumn: string | ((row: any) => string);
  layout: Layout;
};

export default function View({ layout, idColumn, selectedFilterId, setSelectedFilterId }: ViewProps) {
  const { columns, entityType, orderBy, rowOptions, sortDirection, visibleColumns } = layout;
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const units = useAppSelector(UnitSelector.all);
  const orgId = useAppSelector(UserSelector.orgId)!;

  const [entitiesQuery, setEntitiesQuery] = usePersistedState<GetEntitiesQuery>(`${layout.name}EntitiesQuery`, {
    limit: '10',
    page: '0',
    orderBy,
    sortDirection,
  });
  const [savedFilters, setSavedFilters] = useState<SavedFilterSerialized[]>([]);
  const [savedFiltersIsLoaded, setSavedFiltersIsLoaded] = useState(false);
  const [currentFilter, setCurrentFilter] = usePersistedState<SavedFilterSerialized>(`${layout.name}CurrentFilter`, makeNoFilter(entityType));
  const [filterSelectorOpen, setFilterSelectorOpen] = useState(false);
  const [filterEditorOpen, setFilterEditorOpen] = usePersistedState(`${layout.name}FilterEditorOpen`, false);
  const [saveNewFilterDialogOpen, setSaveNewFilterDialogOpen] = useState(false);
  const [newFilter, setNewFilter] = useState<SavedFilterSerialized | undefined>();
  const selectFilterButtonRef = useRef<HTMLButtonElement>(null);

  const {
    data: entities,
    error: entitiesError,
    refetch: refetchEntities,
    isFetching: entitiesFetching,
  } = entityApi[entityType].useGetEntitiesQuery({
    orgId,
    query: useMemo(() => ({
      ...entitiesQuery,
      filterConfig: getCleanedFilterConfig(currentFilter.config),
    }), [entitiesQuery, currentFilter.config]),
  });

  const filters = useMemo<SavedFilterSerialized[]>(() => {
    return [
      makeNoFilter(entityType),
      makeCustomFilter(entityType),
      ...savedFilters,
    ];
  }, [entityType, savedFilters]);

  const queryBuilderFields = useMemo((): QueryField[] => {
    return columns.map(column => {
      let type = column.type;
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
        table: column.table,
      };
    });
  }, [columns, units]);

  const fetchSavedFilters = useCallback(async () => {
    let savedFiltersNew: SavedFilterSerialized[];
    try {
      savedFiltersNew = await SavedFilterClient.getSavedFilters(orgId, { entityType });
    } catch (error) {
      void dispatch(Modal.alert('Get Saved Filters', formatErrorMessage(error, 'Failed to get saved filters')));
      return;
    }

    setSavedFilters(savedFiltersNew);
    setSavedFiltersIsLoaded(true);
  }, [dispatch, entityType, orgId, setSavedFilters]);

  const isSavedFilter = useCallback((filter: SavedFilterSerialized) => {
    return filter.id !== noFilterId && filter.id !== customFilterId;
  }, []);

  // Create references for the expressions for given column types (currently just time).
  // This allows a column to use an expression that references another column.
  const expressionRefsByType = useMemo(() => {
    const expressionRefs = new Map<QueryValueType, ExpressionReference[]>();
    columns.forEach((col: ColumnInfo) => {
      if (!expressionRefs.get(col.type)) {
        const entries: ExpressionReference[] = [];
        expressionRefs.set(col.type, entries);
      }
      const ref: ExpressionReference = {
        displayName: getFullyQualifiedColumnDisplayName(col),
        reference: getFullyQualifiedColumnName(col),
      };
      expressionRefs.get(col.type)?.push(ref);
    });
    return expressionRefs;
  }, [columns]);

  const handleChangeFilterQueryRows = useCallback((queryRowsNew: QueryRow[]) => {
    setCurrentFilter({
      ...currentFilter,
      config: queryRowsToFilterConfig(queryRowsNew),
    });
  }, [setCurrentFilter, currentFilter]);

  const handleSortChanged = useCallback((column: TableColumn, direction: SortDirection) => {
    setEntitiesQuery({
      ...entitiesQuery,
      orderBy: column.name,
      sortDirection: direction,
    });
  }, [setEntitiesQuery, entitiesQuery]);

  const handleChangePage = useCallback((event: MouseEvent<HTMLButtonElement> | null, page: number) => {
    setEntitiesQuery({
      ...entitiesQuery,
      page: `${page}`,
    });
  }, [setEntitiesQuery, entitiesQuery]);

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const page = getNewPageIndex(+entitiesQuery.limit, +entitiesQuery.page, +event.target.value);
    setEntitiesQuery({
      limit: event.target.value,
      page: `${page}`,
    });
  };

  const handleFilterSaveClick = useCallback(async () => {
    // If this is a custom filter then we need to create a new saved filter.
    if (isCustomFilter(currentFilter.id)) {
      setNewFilter({ ...currentFilter });
      setSaveNewFilterDialogOpen(true);
      return;
    }

    const result = await dispatch(Modal.confirm('Overwrite Saved Filter', 'Are you sure?', {
      confirmText: 'Overwrite',
    }));

    if (!result?.button?.value) {
      return;
    }

    await SavedFilterClient.updateSavedFilter(orgId, currentFilter.id, {
      config: currentFilter.config,
    });

    await fetchSavedFilters();
  }, [currentFilter, dispatch, fetchSavedFilters, orgId]);

  const filterHasChanges = useMemo(() => {
    if (selectedFilterId === noFilterId) {
      return false;
    }

    if (selectedFilterId === customFilterId) {
      return true;
    }

    const savedFilter = savedFilters.find(x => x.id === selectedFilterId);
    if (!savedFilter) {
      return false;
    }

    return !deepEquals(currentFilter.config, savedFilter.config);
  }, [currentFilter.config, savedFilters, selectedFilterId]);

  const handleSaveNewFilterConfirm = async (filter: SavedFilterSerialized) => {
    let filterSaved: SavedFilterSerialized;
    try {
      filterSaved = await SavedFilterClient.addSavedFilter(orgId, {
        name: filter.name,
        entityType: filter.entityType,
        config: filter.config,
      });
    } catch (err) {
      void dispatch(Modal.alert('Save New Filter', `Unable to save filter: ${formatErrorMessage(err)}`));
      return;
    }

    await fetchSavedFilters();

    selectFilter(filterSaved);
    setSaveNewFilterDialogOpen(false);
  };

  const handleSaveNewFilterCancel = useCallback(() => {
    setSaveNewFilterDialogOpen(false);
  }, []);

  const selectFilter = useCallback((filter: SavedFilterSerialized) => {
    setSelectedFilterId(filter.id);
    setCurrentFilter({ ...filter });
    setFilterSelectorOpen(false);

    if (filter.id === customFilterId) {
      setFilterEditorOpen(true);
    }
  }, [setSelectedFilterId, setCurrentFilter, setFilterEditorOpen]);

  const handleFilterDuplicateClick = useCallback((filter: SavedFilterSerialized) => {
    setNewFilter({ ...filter });
    setSaveNewFilterDialogOpen(true);
  }, []);

  const handleFilterDeleteClick = useCallback(async (filter: SavedFilterSerialized) => {
    const result = await dispatch(Modal.confirm(`Delete Filter "${filter.name}"`, 'Are you sure?', {
      destructive: true,
      confirmText: 'Delete',
    }));

    if (!result?.button?.value) {
      return;
    }

    await SavedFilterClient.deleteSavedFilter(orgId, filter.id);

    await fetchSavedFilters();
  }, [dispatch, fetchSavedFilters, orgId]);

  const queryRows = useMemo(() => {
    return filterConfigToQueryRows(currentFilter.config, queryBuilderFields);
  }, [currentFilter.config, queryBuilderFields]);

  //
  // Effects
  //
  useEffectDebounced(() => {
    void dispatch(Unit.fetch(orgId));
  }, [dispatch, orgId]);

  useEffectDebounced(() => {
    void refetchEntities();
  }, [refetchEntities, currentFilter.config]);

  useEffect(() => {
    if (entitiesError) {
      void dispatch(Modal.alert('Error', formatErrorMessage(entitiesError, 'Error Applying Filters')));
    }
  }, [dispatch, entitiesError]);

  useEffectDebounced(() => {
    void fetchSavedFilters();
  }, [fetchSavedFilters]);

  // Reset to no filter if the selected filter wasn't found.
  useEffect(() => {
    if (!savedFiltersIsLoaded) {
      return;
    }

    const selectedFilterFound = filters.some(x => x.id === selectedFilterId);
    if (!selectedFilterFound) {
      setSelectedFilterId(noFilterId);
    }
  }, [filters, savedFiltersIsLoaded, selectedFilterId, setSelectedFilterId]);

  // Set the current filter if the selected filter id changes.
  useEffect(() => {
    const filter = filters.find(x => x.id === selectedFilterId);
    if (!filter) {
      setCurrentFilter({ ...makeNoFilter(entityType) });
      return;
    }

    if (currentFilter.id !== filter.id) {
      setCurrentFilter({ ...filter });
    }
  }, [currentFilter.id, entityType, filters, selectedFilterId, setCurrentFilter]);

  return (
    <TableContainer component={Paper}>
      <Box className={classes.tableHeader}>
        <Box>
          <Button
            aria-label="Select Filter"
            className={classes.tableHeaderButtonSelect}
            onClick={() => setFilterSelectorOpen(!filterSelectorOpen)}
            size="small"
            startIcon={<FilterListIcon />}
            endIcon={filterSelectorOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            variant="outlined"
            ref={selectFilterButtonRef}
          >
            <span className={classes.filterButtonText}>
              {currentFilter.name}
            </span>
          </Button>

          <SavedItemSelector
            anchorEl={selectFilterButtonRef.current}
            open={filterSelectorOpen}
            onClose={() => setFilterSelectorOpen(false)}
            items={filters}
            onItemClick={selectFilter}
            onItemDuplicateClick={handleFilterDuplicateClick}
            onItemDeleteClick={handleFilterDeleteClick}
            showItemDuplicateButton={isSavedFilter}
            showItemDeleteButton={isSavedFilter}
          />

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
          queryRows={queryRows}
          expressionRefsByType={expressionRefsByType}
          onChangeQueryRows={handleChangeFilterQueryRows}
          onSaveClick={handleFilterSaveClick}
          hasChanges={filterHasChanges}
          showAddCriteriaButton
          showSaveButton
        />
      </Collapse>

      <div className={classes.tableWrapper}>
        <TableCustomColumnsContent
          rows={entities?.rows ?? []}
          columns={ColumnInfoToTableColumns(visibleColumns)}
          sortable
          defaultSort={orderBy && sortDirection ? { column: orderBy, direction: sortDirection ?? 'ASC' } : undefined}
          onSortChange={handleSortChanged}
          idColumn={idColumn ?? 'id'}
          noDataText={entitiesFetching ? 'Searching...' : 'No Data'}
          rowOptions={rowOptions}
        />
        <TablePagination
          className={classes.pagination}
          count={entities?.totalRowsCount ?? 0}
          page={+entitiesQuery.page}
          rowsPerPage={+entitiesQuery.limit}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      <SaveNewFilterDialog
        open={saveNewFilterDialogOpen}
        filter={newFilter}
        onSave={handleSaveNewFilterConfirm}
        onCancel={handleSaveNewFilterCancel}
      />
    </TableContainer>
  );
}
