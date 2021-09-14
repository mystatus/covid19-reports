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
  GetEntitiesQuery,
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
import { filterConfigToQueryRows, QueryField, QueryFieldEnumItem, QueryRow, queryRowsToFilterConfig } from '../../utility/query-builder-utils';
import { SavedFilterClient } from '../../client/saved-filter.client';
import { SaveNewFilterDialog } from '../pages/roster-page/save-new-filter-dialog';
import { Layout } from './view-layout';
import { entityApi } from '../../api/entity.api';

type ViewProps = {
  idColumn: string | ((row: any) => string);
  layout: Layout;
};

type FilterId = SavedFilterSerialized['id'];
const customFilterId = -1;
const noFilterId = -2;

export default function View({ layout, idColumn }: ViewProps) {
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
  const [selectedFilterId, setSelectedFilterId] = usePersistedState<FilterId>(`${layout.name}selectedFilterId`, noFilterId);
  const [selectFilterMenuOpen, setSelectFilterMenuOpen] = useState(false);
  const [filterEditorOpen, setFilterEditorOpen] = usePersistedState(`${layout.name}FilterEditorOpen`, false);
  const [filterQueryRows, setFilterQueryRows] = usePersistedState<QueryRow[]>(`${layout.name}FilterQueryRows`, []);
  const [saveNewFilterDialogOpen, setSaveNewFilterDialogOpen] = useState(false);
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
      filterConfig: queryRowsToFilterConfig(filterQueryRows),
    }), [entitiesQuery, filterQueryRows]),
  });

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
    void refetchEntities();
  }, [refetchEntities, filterQueryRows]);

  useEffect(() => {
    if (entitiesError) {
      void dispatch(Modal.alert('Error', formatErrorMessage(entitiesError, 'Error Applying Filters')));
    }
  }, [dispatch, entitiesError]);

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
        onSave={handleSaveNewFilterConfirm}
        onCancel={() => setSaveNewFilterDialogOpen(false)}
      />
    </TableContainer>
  );
}
