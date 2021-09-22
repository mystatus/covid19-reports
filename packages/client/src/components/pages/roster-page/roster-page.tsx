import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Container,
  Divider,
  FormControlLabel,
  Menu,
  MenuItem,
  Paper,
  TableContainer,
  TextField,
} from '@material-ui/core';
import BackupIcon from '@material-ui/icons/Backup';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import React, {
  ChangeEvent,
  createRef,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  OrphanedRecordActionType,
  ColumnType,
  SavedFilterSerialized,
  ColumnInfo,
  GetEntitiesQuery,
} from '@covid19-reports/shared';
import deepEquals from 'fast-deep-equal';
import { Roster } from '../../../actions/roster.actions';
import { Unit } from '../../../actions/unit.actions';
import useEffectDebounced from '../../../hooks/use-effect-debounced';
import useInitialLoading from '../../../hooks/use-initial-loading';
import { downloadFile } from '../../../utility/download';
import { getNewPageIndex } from '../../../utility/table';
import PageHeader from '../../page-header/page-header';
import {
  ColumnInfoToTableColumns,
  SortDirection,
  TableColumn,
  TableCustomColumnsContent,
} from '../../tables/table-custom-columns-content';
import { TablePagination } from '../../tables/table-pagination/table-pagination';
import { RosterPageHelp } from './roster-page-help';
import useStyles from './roster-page.styles';
import {
  ApiOrphanedRecord,
  ApiRosterEntry,
  ApiRosterEntryData,
  ApiRosterEnumColumnConfig,
} from '../../../models/api-response';
import {
  EditRosterEntryDialog,
  EditRosterEntryDialogProps,
} from './edit-roster-entry-dialog';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { UnitSelector } from '../../../selectors/unit.selector';
import { OrphanedRecordSelector } from '../../../selectors/orphaned-record.selector';
import { QueryBuilder } from '../../query-builder/query-builder';
import { formatErrorMessage } from '../../../utility/errors';
import { ButtonSet } from '../../buttons/button-set';
import { DataExportIcon } from '../../icons/data-export-icon';
import { Modal } from '../../../actions/modal.actions';
import { UserSelector } from '../../../selectors/user.selector';
import usePersistedState from '../../../hooks/use-persisted-state';
import { ExportClient } from '../../../client/export.client';
import { OrphanedRecordClient } from '../../../client/orphaned-record.client';
import { RosterClient } from '../../../client/roster.client';
import { SavedFilterClient } from '../../../client/saved-filter.client';
import { AppFrameActions } from '../../../slices/app-frame.slice';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { OrphanedRecordActions } from '../../../slices/orphaned-record.slice';
import { useAppSelector } from '../../../hooks/use-app-selector';
import {
  filterConfigToQueryRows,
  QueryField,
  QueryFieldEnumItem,
  QueryRow,
  queryRowsToFilterConfig,
} from '../../../utility/query-builder-utils';
import { SaveNewFilterDialog } from './save-new-filter-dialog';

const unitColumn: ColumnInfo = {
  name: 'unit',
  displayName: 'Unit',
  custom: false,
  phi: false,
  pii: false,
  type: ColumnType.String,
  updatable: true,
  required: false,
  config: {},
};

interface SortState {
  column: string;
  sortDirection: SortDirection;
}

type FilterId = SavedFilterSerialized['id'];
const customFilterId = -1;
const noFilterId = -2;

export const RosterPage = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const units = useAppSelector(UnitSelector.all);
  const orphanedRecords = useAppSelector(OrphanedRecordSelector.root);
  const org = useAppSelector(UserSelector.org)!;
  const canManageRoster = useAppSelector(UserSelector.canManageRoster);

  // Orphaned Records Table
  const [orphanedRecordsWaiting, setOrphanedRecordsWaiting] = useState(false);
  const [orphanedRecordsPage, setOrphanedRecordsPage] = useState(0);
  const [orphanedRecordsRowsPerPage, setOrphanedRecordsRowsPerPage] = usePersistedState('orphanRowsPerPage', 10);
  const [orphanedRecordsUnitFilter, setOrphanedRecordsUnitFilter] = usePersistedState('orphanUnitFilter', '');

  // Roster Table
  const [rows, setRows] = useState<ApiRosterEntry[]>([]);
  const [page, setPage] = useState(0);
  const [totalRowsCount, setTotalRowsCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = usePersistedState('rosterRowsPerPage', 10);
  const [unitNameMap, setUnitNameMap] = useState<{ [key: string]: string }>({});
  const [editRosterEntryDialogProps, setEditRosterEntryDialogProps] = useState<EditRosterEntryDialogProps>({ open: false });
  const [downloadTemplateLoading, setDownloadTemplateLoading] = useState(false);
  const [exportRosterLoading, setExportRosterLoading] = useState(false);
  const [sortState, setSortState] = usePersistedState<SortState>('rosterSort');
  const [rosterColumnInfos, setRosterColumnInfos] = useState<ColumnInfo[]>([]);
  const fetchRosterInvokeCount = useRef(0);
  const fileInputRef = createRef<HTMLInputElement>();

  // Roster Filter
  const [savedFilters, setSavedFilters] = useState<SavedFilterSerialized[]>([]);
  const [selectedFilterId, setSelectedFilterId] = usePersistedState<FilterId>('selectedFilterId', noFilterId);
  const [selectFilterMenuOpen, setSelectFilterMenuOpen] = useState(false);
  const [filterEditorOpen, setFilterEditorOpen] = usePersistedState('rosterFilterEditorOpen', false);
  const [filterQueryRows, setFilterQueryRows] = usePersistedState<QueryRow[]>('rosterFilterQueryRows', []);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [saveNewFilterDialogOpen, setSaveNewFilterDialogOpen] = useState(false);
  const selectFilterButtonRef = useRef<HTMLButtonElement>(null);

  // Roster Visible Columns
  const [visibleColumns, setVisibleColumns] = usePersistedState<ColumnInfo[]>('rosterVisibleColumns', []);
  const [visibleColumnsMenuOpen, setVisibleColumnsMenuOpen] = useState(false);
  const visibleColumnsButtonRef = useRef<HTMLDivElement>(null);

  const orgId = org.id;
  const orgName = org.name;
  const maxNumColumnsToShow = 5;

  const queryBuilderFields = useMemo((): QueryField[] => {
    return rosterColumnInfos.map(column => {
      let type = column.type as unknown as ColumnType;
      let enumItems: QueryFieldEnumItem[] | undefined;

      if (column.name === 'unit') {
        type = ColumnType.Enum;
        enumItems = units.map(({ id, name }) => ({ label: name, value: id }));
      } else if (column.type === ColumnType.Enum) {
        const options = (column.config as ApiRosterEnumColumnConfig)?.options?.slice() ?? [];
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
  }, [rosterColumnInfos, units]);

  //
  // Effects
  //

  const [
    initialLoadStep,
    incrementInitialLoadStep,
    initialLoadComplete,
  ] = useInitialLoading();

  const fetchRoster = useCallback(async () => {
    // fetchRoster can be called multiple times in close proximity resulting in possible a race condition
    // where API responses return out of order relative to the invocation order.
    //
    // Therefore, we track the latest invocation using an ever incrementing integer value
    // store in a captured ref (fetchRosterInvokeCount) and compare it to the locally scoped
    // copy (fetchRosterInvocation) of that value to ensure that our component state always
    // represents the results of the latest invocation.
    fetchRosterInvokeCount.current += 1;
    const fetchRosterInvocation = fetchRosterInvokeCount.current;

    try {
      const query: GetEntitiesQuery = {
        limit: `${rowsPerPage}`,
        page: `${page}`,
      };
      if (sortState) {
        query.orderBy = sortState.column;
        query.sortDirection = sortState.sortDirection;
      }
      if (filterQueryRows?.length) {
        if (fetchRosterInvokeCount.current === fetchRosterInvocation) {
          setApplyingFilters(true);
          setTotalRowsCount(0);
        }

        query.filterConfig = queryRowsToFilterConfig(filterQueryRows);
        const data = await RosterClient.getRoster(orgId, query);

        setApplyingFilters(false);
        if (fetchRosterInvokeCount.current === fetchRosterInvocation) {
          setRows(data.rows);
          setTotalRowsCount(data.totalRowsCount);
        }
      } else {
        const data = await RosterClient.getRoster(orgId, query);
        if (fetchRosterInvokeCount.current === fetchRosterInvocation) {
          setRows(data.rows);
          setTotalRowsCount(data.totalRowsCount);
        }
      }
    } catch (e) {
      void dispatch(Modal.alert('Error', formatErrorMessage(e, 'Error Applying Filters')));
    }
  }, [dispatch, page, rowsPerPage, orgId, filterQueryRows, sortState]);

  const fetchRosterEntry = useCallback(async (orphanedRecord: ApiOrphanedRecord) => {
    try {
      const query: GetEntitiesQuery = {
        limit: '1',
        page: '0',
        filterConfig: {
          edipi: { op: '=', value: orphanedRecord.edipi, expression: '', expressionEnabled: false },
          ...(
            orphanedRecord.unitId && {
              unit: { op: '=', value: orphanedRecord.unitId, expression: '', expressionEnabled: false },
            }
          ),
        },
      };
      const data = await RosterClient.getRoster(orgId, query);
      return data.rows.length ? data.rows[0] : null;
    } catch (e) {
      void dispatch(Modal.alert('Error', formatErrorMessage(e, 'Error Getting Roster Entry for Orphan')));
    }
    return null;
  }, [dispatch, orgId]);

  const fetchRosterColumnInfo = useCallback(async () => {
    try {
      const infos = await RosterClient.getAllowedRosterColumnsInfo(orgId);
      const unitColumnWithInfos = sortRosterColumns([unitColumn, ...infos]);
      setRosterColumnInfos(unitColumnWithInfos);

      if (!initialLoadComplete && visibleColumns.length === 0) {
        setVisibleColumns(unitColumnWithInfos.slice(0, maxNumColumnsToShow));
      }
    } catch (error) {
      void dispatch(Modal.alert('Get Roster Column Info', formatErrorMessage(error, 'Failed to get roster column info')));
    }
  }, [dispatch, initialLoadComplete, orgId, setVisibleColumns, visibleColumns.length]);

  const fetchSavedFilters = useCallback(async () => {
    try {
      const filters = await SavedFilterClient.getSavedFilters(orgId, {
        entityType: 'roster',
      });
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
  }, [dispatch, orgId, setSavedFilters, selectedFilterId, setSelectedFilterId]);

  const fetchUnits = useCallback(() => {
    void dispatch(Unit.fetch(orgId));
  }, [dispatch, orgId]);

  const fetchOrphanedRecords = useCallback(async () => {
    if (!canManageRoster) {
      dispatch(OrphanedRecordActions.clear());
      return;
    }

    const unitFilter = orphanedRecordsUnitFilter || undefined;

    try {
      await dispatch(OrphanedRecordActions.fetchPage({
        orgId,
        query: {
          page: `${orphanedRecordsPage}`,
          limit: `${orphanedRecordsRowsPerPage}`,
          unit: unitFilter,
        },
      }));
    } catch (error) {
      void dispatch(Modal.alert('Get Orphaned Records', formatErrorMessage(error, 'Failed to get orphaned records')));
    }
  }, [canManageRoster, dispatch, orgId, orphanedRecordsPage, orphanedRecordsRowsPerPage, orphanedRecordsUnitFilter]);

  const getSelectedSavedFilter = useCallback(() => {
    return savedFilters.find(x => x.id === selectedFilterId);
  }, [savedFilters, selectedFilterId]);

  const handleChangeFilterQueryRows = useCallback((queryRows: QueryRow[]) => {
    setFilterQueryRows(queryRows);
  }, [setFilterQueryRows]);

  // Initial load.
  useEffect(() => {
    dispatch(AppFrameActions.setPageLoading({ isLoading: !initialLoadComplete }));
  }, [dispatch, initialLoadComplete]);

  useEffect(() => {
    if (initialLoadStep === 0) {
      void (async () => {
        await Promise.all([
          fetchRosterColumnInfo(),
          fetchUnits(),
          fetchSavedFilters(),
        ]);
        incrementInitialLoadStep();
      })();
    }
  }, [initialLoadStep, fetchRosterColumnInfo, fetchUnits, fetchSavedFilters, incrementInitialLoadStep]);

  useEffect(() => {
    if (initialLoadStep === 1) {
      void (async () => {
        await Promise.all([
          fetchOrphanedRecords(),
          fetchRoster(),
        ]);
        incrementInitialLoadStep(true);
      })();
    }
  }, [initialLoadStep, fetchOrphanedRecords, fetchRoster, incrementInitialLoadStep]);

  // Orphaned records reload.
  useEffectDebounced(() => {
    void fetchOrphanedRecords();
  }, [fetchOrphanedRecords]);

  // Roster reload.
  useEffectDebounced(() => {
    void fetchRoster();
  }, [fetchRoster]);

  // Units dropdown refresh.
  useEffect(() => {
    const unitNames: { [key: string]: string } = {};
    for (const unit of units) {
      unitNames[unit.id] = unit.name;
    }
    setUnitNameMap(unitNames);
  }, [units]);

  // Refresh roster filter query rows on selected filter change.
  useEffect(() => {
    const savedFilter = getSelectedSavedFilter();
    if (savedFilter) {
      const queryRowsNew = filterConfigToQueryRows(savedFilter.config, queryBuilderFields);
      setFilterQueryRows(queryRowsNew);
    } else if (selectedFilterId === noFilterId) {
      setFilterQueryRows([]);
    }
  }, [queryBuilderFields, getSelectedSavedFilter, selectedFilterId, setFilterQueryRows]);

  //
  // Functions
  //

  const sortRosterColumns = (columns: ColumnInfo[]) => {
    const columnPriority: {
      [key: string]: number | undefined;
      default: number;
    } = {
      edipi: 1,
      firstName: 2,
      lastName: 3,
      unit: 4,
      default: 5,
    };
    return columns.sort((a: ColumnInfo, b: ColumnInfo) => {
      return (columnPriority[a.name] || columnPriority.default) - (columnPriority[b.name] || columnPriority.default);
    });
  };

  const handleRosterOrOrphanedRecordsModified = async () => {
    await Promise.all([
      fetchOrphanedRecords(),
      fetchRoster(),
    ]);
  };

  const handleSortChanged = (column: TableColumn, direction: SortDirection) => {
    setSortState({
      column: column.name,
      sortDirection: direction,
    });
  };

  const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, pageNew: number) => {
    setPage(pageNew);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rowsPerPageNew = parseInt(event.target.value);
    const pageNew = getNewPageIndex(rowsPerPage, page, rowsPerPageNew);
    setRowsPerPage(rowsPerPageNew);
    setPage(pageNew);
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files[0] == null) {
      return;
    }

    let uploadCount: number;
    try {
      const data = await RosterClient.uploadRosterEntries(orgId, e.target.files[0]);
      uploadCount = data.count;
    } catch (err) {
      const message = formatErrorMessage(err);
      void dispatch(Modal.alert('Upload Error', message));
      return;
    } finally {
      // Clear the file input value.
      fileInputRef.current!.value = '';
    }

    void dispatch(Modal.alert('Upload Successful', `Successfully uploaded ${uploadCount} roster entries.`));
    void handleRosterOrOrphanedRecordsModified();
  };

  const getCellDisplayValue = (rosterEntry: ApiRosterEntry, column: ColumnInfo) => {
    const value = rosterEntry[column.name];
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

  const editEntryClicked = (rosterEntry: ApiRosterEntry) => {
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterColumnInfos,
      rosterEntry,
      onClose: () => {
        setEditRosterEntryDialogProps({ open: false });
        void handleRosterOrOrphanedRecordsModified();
      },
      onError: (message: string) => {
        void dispatch(Modal.alert('Edit Roster Entry', `Unable to edit roster entry: ${message}`));
      },
    });
  };

  const addEntryClicked = () => {
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterColumnInfos,
      onClose: () => {
        setEditRosterEntryDialogProps({ open: false });
        void handleRosterOrOrphanedRecordsModified();
      },
      onError: (message: string) => {
        void dispatch(Modal.alert('Add Roster Entry', `Unable to add roster entry: ${message}`));
      },
    });
  };

  const deleteAllEntriesClicked = async () => {
    const title = 'Delete All Entries';
    const message = 'This will permanently delete ALL roster entries. Are you sure?';
    const result = await dispatch(Modal.confirm(title, message, {
      destructive: true,
      confirmText: 'Delete All',
    }));

    if (!result?.button?.value) {
      return;
    }

    try {
      await dispatch(Roster.deleteAll(orgId));
    } catch (err) {
      void dispatch(Modal.alert('Delete All Entries', formatErrorMessage(err, 'Unable to delete all entries')));
    }

    void handleRosterOrOrphanedRecordsModified();
  };

  const deleteEntryClicked = async (rosterEntry: ApiRosterEntry) => {
    const title = 'Delete Roster Entry';
    const message = 'Are you sure you want to delete this roster entry?';
    const result = await dispatch(Modal.confirm(title, message, {
      destructive: true,
      confirmText: 'Delete',
    }));

    if (!result?.button?.value) {
      return;
    }

    try {
      await RosterClient.deleteRosterEntry(orgId, rosterEntry.id);
    } catch (err) {
      void dispatch(Modal.alert('Remove Roster Entry', formatErrorMessage(err, 'Unable to remove roster entry')));
    }

    void handleRosterOrOrphanedRecordsModified();
  };

  const downloadCSVExport = async () => {
    try {
      setExportRosterLoading(true);
      const data = await ExportClient.exportRosterToCsv(orgId);

      const date = new Date().toISOString();
      const filename = `${_.kebabCase(orgName)}_roster_export_${date}`;
      downloadFile(data, filename, 'csv');
    } catch (error) {
      void dispatch(Modal.alert('Roster CSV Export', formatErrorMessage(error, 'Unable to export roster to CSV')));
    } finally {
      setExportRosterLoading(false);
    }
  };

  const downloadCSVTemplate = async () => {
    try {
      setDownloadTemplateLoading(true);
      const data = await RosterClient.getRosterTemplate(orgId);
      downloadFile(data, 'roster-template', 'csv');
    } catch (error) {
      void dispatch(Modal.alert('CSV Template Download', formatErrorMessage(error, 'Unable to download CSV template')));
    } finally {
      setDownloadTemplateLoading(false);
    }
  };

  const addOrphanToRosterClicked = (row: ApiOrphanedRecord) => {
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterColumnInfos,
      prepopulated: {
        edipi: row.edipi,
        unit: units.find(unit => unit.name === row.unit)?.id,
      },
      onSave: (body: ApiRosterEntryData) => {
        return OrphanedRecordClient.resolveOrphanedRecordWithAdd(orgId, row.id, body);
      },
      onClose: () => {
        setEditRosterEntryDialogProps({ open: false });
        void handleRosterOrOrphanedRecordsModified();
      },
      onError: (message: string) => {
        void dispatch(Modal.alert('Add Orphan to Roster', `Unable to add orphan to roster: ${message}`));
      },
    });
  };

  const editOrphanOnRosterClicked = async (row: ApiOrphanedRecord) => {
    const rosterEntry = await fetchRosterEntry(row);
    if (!rosterEntry) {
      void dispatch(Modal.alert('Edit Roster Entry for Orphan', `Unable to find the roster entry`));
      return;
    }
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterColumnInfos,
      rosterEntry,
      orphanedRecord: row,
      onSave: (body: ApiRosterEntry) => {
        return OrphanedRecordClient.resolveOrphanedRecordWithEdit(orgId, row.id, body);
      },
      onClose: () => {
        setEditRosterEntryDialogProps({ open: false });
        void handleRosterOrOrphanedRecordsModified();
      },
      onError: (message: string) => {
        void dispatch(Modal.alert('Edit Roster Entry for Orphan', `Unable to edit the roster entry: ${message}`));
      },
    });
  };

  const ignoreOrphanClicked = async (row: ApiOrphanedRecord) => {
    const title = 'Ignore Orphaned Record';
    const message = 'This orphaned record will be permanently hidden from your view but will remain visible to other roster managers.';
    const result = await dispatch(Modal.confirm(title, message, {
      destructive: true,
      confirmText: 'Ignore',
    }));

    if (!result?.button?.value) {
      return;
    }

    try {
      setOrphanedRecordsWaiting(true);
      await OrphanedRecordClient.addOrphanedRecordAction(orgId, row.id, {
        action: OrphanedRecordActionType.Ignore,
        timeToLiveMs: Math.max(0, result.button.value * 60 * 60 * 1000),
      });
      await handleRosterOrOrphanedRecordsModified();
    } catch (error) {
      void dispatch(Modal.alert('Ignore Orphan', formatErrorMessage(error, 'Unable to ignore the record')));
    } finally {
      setOrphanedRecordsWaiting(false);
    }
  };

  const getOrphanCellDisplayValue = (orphanedRecord: ApiOrphanedRecord, column: { name: keyof ApiOrphanedRecord }) => {
    const value = orphanedRecord[column.name];
    if (value) {
      if (column.name === 'earliestReportDate' || column.name === 'latestReportDate') {
        return moment(value).format('Y-M-D h:mm A z');
      }
    } else if (column.name === 'phone' || column.name === 'unit') {
      return 'none';
    }
    return value;
  };

  const handleOrphanedRecordsChangePage = (event: MouseEvent<HTMLButtonElement> | null, pageNew: number) => {
    setOrphanedRecordsPage(pageNew);
  };

  const handleOrphanedRecordsChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rowsPerPageNew = parseInt(event.target.value);
    const pageNew = getNewPageIndex(orphanedRecordsRowsPerPage, orphanedRecordsPage, rowsPerPageNew);
    setOrphanedRecordsRowsPerPage(rowsPerPageNew);
    setOrphanedRecordsPage(pageNew);
  };

  const handleOrphanedRecordsUnitFilterChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    setOrphanedRecordsUnitFilter(event.target.value as string);
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
        entityType: 'roster',
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

  //
  // Render
  //

  return (
    <main className={classes.root}>
      <Container maxWidth={false}>
        <PageHeader
          title="Roster"
          help={{
            contentComponent: RosterPageHelp,
            cardId: 'rosterPage',
          }}
        />

        {/* Orphaned Records */}
        <TableContainer component={Paper} className={classes.table}>
          <Box className={classes.tableHeader}>
            <h2>Orphaned Records ({orphanedRecords.count})</h2>

            <Box display="flex" alignItems="center">
              <Box fontWeight="bold">
                <label>Unit contains</label>
              </Box>

              <TextField
                className={classes.orphanUnitFilterTextField}
                onChange={handleOrphanedRecordsUnitFilterChange}
                value={orphanedRecordsUnitFilter}
              />
            </Box>
          </Box>

          <TableCustomColumnsContent
            rows={orphanedRecords.rows}
            columns={[
              { name: 'edipi', displayName: 'DoD ID', fullyQualifiedName: 'orphanedRecord.edipi', type: ColumnType.String },
              { name: 'unit', displayName: 'Unit', fullyQualifiedName: 'orphanedRecord.unit', type: ColumnType.String },
              { name: 'phone', displayName: 'Phone', fullyQualifiedName: 'orphanedRecord.phone', type: ColumnType.String },
              { name: 'count', displayName: 'Count', fullyQualifiedName: 'orphanedRecord.count', type: ColumnType.Number },
              { name: 'earliestReportDate', displayName: 'First Report', fullyQualifiedName: 'orphanedRecord.earliestReportDate', type: ColumnType.DateTime },
              { name: 'latestReportDate', displayName: 'Latest Report', fullyQualifiedName: 'orphanedRecord.latestReportDate', type: ColumnType.DateTime },
            ]}
            idColumn={row => row.id + row.unitId}
            rowOptions={{
              menuItems: row => ([{
                callback: addOrphanToRosterClicked,
                disabled: orphanedRecordsWaiting,
                name: 'Add to Roster...',
                hidden: row.unitId,
              }, {
                callback: editOrphanOnRosterClicked,
                disabled: orphanedRecordsWaiting,
                name: 'Edit Existing Entry...',
                hidden: !row.unitId,
              }, {
                callback: ignoreOrphanClicked,
                disabled: orphanedRecordsWaiting,
                name: 'Ignore...',
              }]),
              renderCell: getOrphanCellDisplayValue,
            }}
          />

          <TablePagination
            className={classes.pagination}
            count={orphanedRecords.totalRowsCount}
            page={orphanedRecordsPage}
            rowsPerPage={orphanedRecordsRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={handleOrphanedRecordsChangePage}
            onRowsPerPageChange={handleOrphanedRecordsChangeRowsPerPage}
          />
        </TableContainer>

        {/* Roster */}
        <ButtonSet>
          {canManageRoster && (
            <>
              <input
                hidden={!canManageRoster}
                accept="text/csv"
                id="raised-button-file"
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />

              <label
                htmlFor="raised-button-file"
                hidden={!canManageRoster}
              >
                <Button
                  size="large"
                  variant="text"
                  startIcon={<BackupIcon />}
                  component="span"
                >
                  Upload CSV
                </Button>
              </label>

              <ButtonWithSpinner
                hidden={!canManageRoster}
                type="button"
                size="large"
                variant="text"
                startIcon={<CloudDownloadIcon />}
                onClick={() => downloadCSVTemplate()}
                loading={downloadTemplateLoading}
              >
                Download CSV Template
              </ButtonWithSpinner>
            </>
          )}

          <ButtonWithSpinner
            type="button"
            size="large"
            variant="text"
            startIcon={<DataExportIcon />}
            onClick={() => downloadCSVExport()}
            loading={exportRosterLoading}
          >
            Export to CSV
          </ButtonWithSpinner>

          {canManageRoster && (
            <>
              <Button
                hidden={!canManageRoster}
                color="primary"
                size="large"
                variant="text"
                startIcon={<PersonAddIcon />}
                onClick={addEntryClicked}
              >
                Add Individual
              </Button>

              <Button
                hidden={!canManageRoster}
                color="primary"
                size="large"
                variant="text"
                startIcon={<DeleteSweepIcon />}
                onClick={deleteAllEntriesClicked}
              >
                Delete All
              </Button>
            </>
          )}
        </ButtonSet>

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
            {rosterColumnInfos.map(column => (
              <MenuItem key={column.name} className={classes.columnItem}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      color="primary"
                      checked={visibleColumns.some(col => col.name === column.name)}
                      onChange={event => {
                        const { checked } = event.target;
                        if (checked) {
                          setVisibleColumns(rosterColumnInfos.filter(col => col.name === column.name || visibleColumns.some(({ name }) => name === col.name)));
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
              columns={ColumnInfoToTableColumns(visibleColumns)}
              sortable
              defaultSort={sortState ? { column: sortState.column, direction: sortState.sortDirection } : undefined}
              onSortChange={handleSortChanged}
              idColumn="id"
              noDataText={applyingFilters ? 'Searching...' : 'No Data'}
              rowOptions={{
                menuItems: canManageRoster ? [{
                  name: 'Edit Entry',
                  callback: editEntryClicked,
                }, {
                  name: 'Delete Entry',
                  callback: deleteEntryClicked,
                }] : [],
                renderCell: getCellDisplayValue,
              }}
            />

            <TablePagination
              className={classes.pagination}
              count={totalRowsCount}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </TableContainer>
      </Container>

      {editRosterEntryDialogProps.open && (
        <EditRosterEntryDialog {...editRosterEntryDialogProps} />
      )}

      <SaveNewFilterDialog
        open={saveNewFilterDialogOpen}
        onSave={handleSaveNewFilterConfirm}
        onCancel={() => setSaveNewFilterDialogOpen(false)}
      />
    </main>
  );
};
