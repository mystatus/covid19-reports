import {
  Box,
  Button,
  Checkbox,
  Container,
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
import React, {
  ChangeEvent,
  createRef,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import axios from 'axios';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { AppFrame } from '../../../actions/app-frame.actions';
import { OrphanedRecord } from '../../../actions/orphaned-record.actions';
import { Roster } from '../../../actions/roster.actions';
import { Unit } from '../../../actions/unit.actions';
import { RosterClient } from '../../../client';
import useEffectDebounced from '../../../hooks/use-effect-debounced';
import useInitialLoading from '../../../hooks/use-initial-loading';
import { downloadFile } from '../../../utility/download';
import { getNewPageIndex } from '../../../utility/table';
import PageHeader from '../../page-header/page-header';
import {
  SortDirection,
  TableColumn,
  TableCustomColumnsContent,
} from '../../tables/table-custom-columns-content';
import { TablePagination } from '../../tables/table-pagination/table-pagination';
import { RosterPageHelp } from './roster-page-help';
import useStyles from './roster-page.styles';
import {
  ApiRosterColumnInfo,
  ApiRosterColumnType,
  ApiRosterEnumColumnConfig,
  ApiRosterEntry,
  ApiRosterPaginated,
  ApiOrphanedRecord,
  ApiRosterEntryData,
} from '../../../models/api-response';
import {
  EditRosterEntryDialog,
  EditRosterEntryDialogProps,
} from './edit-roster-entry-dialog';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { UnitSelector } from '../../../selectors/unit.selector';
import { OrphanedRecordSelector } from '../../../selectors/orphaned-record.selector';
import {
  QueryBuilder,
  QueryFieldPickListItem,
  QueryFieldType,
  QueryFilterState,
} from '../../query-builder/query-builder';
import { formatErrorMessage } from '../../../utility/errors';
import { ButtonSet } from '../../buttons/button-set';
import { DataExportIcon } from '../../icons/data-export-icon';
import { Modal } from '../../../actions/modal.actions';
import { UserSelector } from '../../../selectors/user.selector';
import usePersistedState from '../../../hooks/use-persisted-state';

const unitColumn: ApiRosterColumnInfo = {
  name: 'unit',
  displayName: 'Unit',
  custom: false,
  phi: false,
  pii: false,
  type: ApiRosterColumnType.String,
  updatable: true,
  required: false,
  config: {},
};

interface SortState {
  column: string,
  sortDirection: SortDirection,
}

export const RosterPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const units = useSelector(UnitSelector.all);
  const orphanedRecords = useSelector(OrphanedRecordSelector.root);
  const org = useSelector(UserSelector.org)!;
  const canManageRoster = useSelector(UserSelector.canManageRoster);

  const fileInputRef = createRef<HTMLInputElement>();
  const visibleColumnsButtonRef = useRef<HTMLDivElement>(null);
  const [orphanedRecordsWaiting, setOrphanedRecordsWaiting] = useState(false);
  const [orphanedRecordsPage, setOrphanedRecordsPage] = useState(0);
  const [orphanedRecordsRowsPerPage, setOrphanedRecordsRowsPerPage] = usePersistedState('orphanRowsPerPage', 10);
  const [orphanedRecordsUnitFilter, setOrphanedRecordsUnitFilter] = usePersistedState('orphanUnitFilter', '');
  const [rows, setRows] = useState<ApiRosterEntry[]>([]);
  const [page, setPage] = useState(0);
  const [totalRowsCount, setTotalRowsCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = usePersistedState('rosterRowsPerPage', 10);
  const [unitNameMap, setUnitNameMap] = useState<{ [key: string]: string }>({});
  const [editRosterEntryDialogProps, setEditRosterEntryDialogProps] = useState<EditRosterEntryDialogProps>({ open: false });
  const [downloadTemplateLoading, setDownloadTemplateLoading] = useState(false);
  const [exportRosterLoading, setExportRosterLoading] = useState(false);
  const [queryFilterState, setQueryFilterState] = usePersistedState<QueryFilterState | undefined>('rosterFilter');
  const [sortState, setSortState] = usePersistedState<SortState>('rosterSort');
  const [rosterColumnInfos, setRosterColumnInfos] = useState<ApiRosterColumnInfo[]>([]);
  const [visibleColumns, setVisibleColumns] = usePersistedState<ApiRosterColumnInfo[]>('rosterVisibleColumns', []);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleColumnsMenuOpen, setVisibleColumnsMenuOpen] = useState(false);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const fetchRosterInvokeCount = useRef(0);

  const orgId = org.id;
  const orgName = org.name;
  const maxNumColumnsToShow = 5;

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
      const params: Record<string, string> = {
        limit: `${rowsPerPage}`,
        page: `${page}`,
      };
      if (sortState) {
        params.orderBy = sortState.column;
        params.sortDirection = sortState.sortDirection;
      }
      if (queryFilterState) {
        if (fetchRosterInvokeCount.current === fetchRosterInvocation) {
          setApplyingFilters(true);
          setTotalRowsCount(0);
        }
        const response = await axios.post(`api/roster/${orgId}/search`, queryFilterState, {
          params,
        });

        const data = response.data as ApiRosterPaginated;

        setApplyingFilters(false);
        if (fetchRosterInvokeCount.current === fetchRosterInvocation) {
          setRows(data.rows);
          setTotalRowsCount(data.totalRowsCount);
        }
      } else {
        const response = await axios(`api/roster/${orgId}`, {
          params,
        });
        const data = response.data as ApiRosterPaginated;
        if (fetchRosterInvokeCount.current === fetchRosterInvocation) {
          setRows(data.rows);
          setTotalRowsCount(data.totalRowsCount);
        }
      }
    } catch (e) {
      dispatch(Modal.alert('Error', formatErrorMessage(e, 'Error Applying Filters'))).then();
    }
  }, [dispatch, page, rowsPerPage, orgId, queryFilterState, sortState]);

  const fetchRosterEntry = useCallback(async (orphanedRecord: ApiOrphanedRecord) => {
    try {
      const params = {
        limit: '1',
        page: '0',
      };
      const query: QueryFilterState = {
        edipi: { op: '=', value: orphanedRecord.edipi, expression: '', expressionEnabled: false },
      };
      if (orphanedRecord.unitId) {
        query.unit = { op: '=', value: orphanedRecord.unitId, expression: '', expressionEnabled: false  };
      }
      const response = await axios.post(`api/roster/${orgId}/search`, query, {
        params,
      });
      const data = response.data as ApiRosterPaginated;
      return data.rows.length ? data.rows[0] : null;

    } catch (e) {
      dispatch(Modal.alert('Error', formatErrorMessage(e, 'Error Getting Roster Entry for Orphan'))).then();
    }
    return null;
  }, [dispatch, orgId]);

  const fetchRosterColumnInfo = useCallback(async () => {
    try {
      const infos = (await axios.get(`api/roster/${orgId}/info`)).data as ApiRosterColumnInfo[];
      const unitColumnWithInfos = sortRosterColumns([unitColumn, ...infos]);
      setRosterColumnInfos(unitColumnWithInfos);

      if (!initialLoadComplete && visibleColumns.length === 0) {
        setVisibleColumns(unitColumnWithInfos.slice(0, maxNumColumnsToShow));
      }
    } catch (error) {
      dispatch(Modal.alert('Get Roster Column Info', formatErrorMessage(error, 'Failed to get roster column info'))).then();
    }
  }, [dispatch, initialLoadComplete, orgId, setVisibleColumns, visibleColumns.length]);

  const fetchUnits = useCallback(async () => {
    dispatch(Unit.fetch(orgId));
  }, [dispatch, orgId]);

  const fetchOrphanedRecords = useCallback(async () => {
    if (!canManageRoster) {
      dispatch(OrphanedRecord.clear());
      return;
    }

    const unitFilter = orphanedRecordsUnitFilter || undefined;

    try {
      await dispatch(OrphanedRecord.fetchPage(orgId, orphanedRecordsPage, orphanedRecordsRowsPerPage, unitFilter));
    } catch (error) {
      dispatch(Modal.alert('Get Orphaned Records', formatErrorMessage(error, 'Failed to get orphaned records'))).then();
    }
  }, [canManageRoster, dispatch, orgId, orphanedRecordsPage, orphanedRecordsRowsPerPage, orphanedRecordsUnitFilter]);

  // Initial load.
  useEffect(() => {
    dispatch(AppFrame.setPageLoading(!initialLoadComplete));
  }, [dispatch, initialLoadComplete]);

  useEffect(() => {
    if (initialLoadStep === 0) {
      Promise.all([
        fetchRosterColumnInfo(),
        fetchUnits(),
      ]).then(incrementInitialLoadStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoadStep]);

  useEffect(() => {
    if (initialLoadStep === 1) {
      Promise.all([
        fetchOrphanedRecords(),
        fetchRoster(),
      ]).then(() => incrementInitialLoadStep(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoadStep]);

  // Orphaned records reload.
  useEffectDebounced(() => {
    fetchOrphanedRecords().then();
  }, [fetchOrphanedRecords]);

  // Roster reload.
  useEffectDebounced(() => {
    fetchRoster().then();
  }, [fetchRoster]);

  // Units dropdown refresh.
  useEffect(() => {
    const unitNames: { [key: string]: string } = {};
    for (const unit of units) {
      unitNames[unit.id] = unit.name;
    }
    setUnitNameMap(unitNames);
  }, [units]);

  //
  // Functions
  //

  const sortRosterColumns = (columns: ApiRosterColumnInfo[]) => {
    const columnPriority: {
      [key: string]: number | undefined,
      default: number,
    } = {
      edipi: 1,
      firstName: 2,
      lastName: 3,
      unit: 4,
      default: 5,
    };
    return columns.sort((a: ApiRosterColumnInfo, b: ApiRosterColumnInfo) => {
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
      const data = await RosterClient.upload(orgId, e.target.files[0]);
      uploadCount = data.count;
    } catch (err) {
      const message = formatErrorMessage(err);
      dispatch(Modal.alert('Upload Error', message)).then();
      return;
    } finally {
      // Clear the file input value.
      fileInputRef.current!.value = '';
    }

    dispatch(Modal.alert('Upload Successful', `Successfully uploaded ${uploadCount} roster entries.`)).then();
    handleRosterOrOrphanedRecordsModified().then();
  };

  const getCellDisplayValue = (rosterEntry: ApiRosterEntry, column: ApiRosterColumnInfo) => {
    const value = rosterEntry[column.name];
    if (value == null) {
      return '';
    }
    if (column.name === 'unit') {
      return unitNameMap[value as string];
    }
    switch (column.type) {
      case ApiRosterColumnType.Date:
        return new Date(value as string).toLocaleDateString();
      case ApiRosterColumnType.DateTime:
        return new Date(value as string).toUTCString();
      case ApiRosterColumnType.Boolean:
        return value ? 'Yes' : 'No';
      default:
        return value;
    }
  };

  const editEntryClicked = async (rosterEntry: ApiRosterEntry) => {
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterColumnInfos,
      rosterEntry,
      onClose: async () => {
        setEditRosterEntryDialogProps({ open: false });
        handleRosterOrOrphanedRecordsModified().then();
      },
      onError: (message: string) => {
        dispatch(Modal.alert('Edit Roster Entry', `Unable to edit roster entry: ${message}`));
      },
    });
  };

  const addEntryClicked = async () => {
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterColumnInfos,
      onClose: async () => {
        setEditRosterEntryDialogProps({ open: false });
        handleRosterOrOrphanedRecordsModified().then();
      },
      onError: (message: string) => {
        dispatch(Modal.alert('Add Roster Entry', `Unable to add roster entry: ${message}`));
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
      dispatch(Modal.alert('Delete All Entries', formatErrorMessage(err, 'Unable to delete all entries'))).then();
    }

    handleRosterOrOrphanedRecordsModified().then();
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
      await axios.delete(`api/roster/${orgId}/${rosterEntry.id}`);
    } catch (err) {
      dispatch(Modal.alert('Remove Roster Entry', formatErrorMessage(err, 'Unable to remove roster entry'))).then();
    }

    handleRosterOrOrphanedRecordsModified().then();
  };

  const downloadCSVExport = async () => {
    try {
      setExportRosterLoading(true);
      const response = await axios({
        url: `api/export/${orgId}/roster`,
        method: 'GET',
        responseType: 'blob',
      });

      const date = new Date().toISOString();
      const filename = `${_.kebabCase(orgName)}_roster_export_${date}`;
      downloadFile(response.data, filename, 'csv');
    } catch (error) {
      dispatch(Modal.alert('Roster CSV Export', formatErrorMessage(error, 'Unable to export roster to CSV'))).then();
    } finally {
      setExportRosterLoading(false);
    }
  };

  const downloadCSVTemplate = async () => {
    try {
      setDownloadTemplateLoading(true);
      const response = await axios({
        url: `api/roster/${orgId}/template`,
        method: 'GET',
        responseType: 'blob',
      });

      downloadFile(response.data, 'roster-template', 'csv');
    } catch (error) {
      dispatch(Modal.alert('CSV Template Download', formatErrorMessage(error, 'Unable to download CSV template'))).then();
    } finally {
      setDownloadTemplateLoading(false);
    }
  };

  const addOrphanToRosterClicked = async (row: ApiOrphanedRecord) => {
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterColumnInfos,
      prepopulated: {
        edipi: row.edipi,
        unit: units.find(unit => unit.name === row.unit)?.id,
      },
      onSave: async (body: ApiRosterEntryData) => {
        return axios.put(`api/orphaned-record/${orgId}/${row.id}/resolve-with-add`, body);
      },
      onClose: async () => {
        setEditRosterEntryDialogProps({ open: false });
        handleRosterOrOrphanedRecordsModified().then();
      },
      onError: (message: string) => {
        dispatch(Modal.alert('Add Orphan to Roster', `Unable to add orphan to roster: ${message}`));
      },
    });
  };

  const editOrphanOnRosterClicked = async (row: ApiOrphanedRecord) => {
    const rosterEntry = await fetchRosterEntry(row);
    if (!rosterEntry) {
      dispatch(Modal.alert('Edit Roster Entry for Orphan', `Unable to find the roster entry`)).then();
      return;
    }
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterColumnInfos,
      rosterEntry,
      orphanedRecord: row,
      onSave: async (body: ApiRosterEntry) => {
        return axios.put(`api/orphaned-record/${orgId}/${row.id}/resolve-with-edit`, body);
      },
      onClose: async () => {
        setEditRosterEntryDialogProps({ open: false });
        handleRosterOrOrphanedRecordsModified().then();
      },
      onError: (message: string) => {
        dispatch(Modal.alert('Edit Roster Entry for Orphan', `Unable to edit the roster entry: ${message}`));
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
      await axios.put(`api/orphaned-record/${orgId}/${row.id}/action`, {
        action: 'ignore',
        timeToLiveMs: Math.max(0, result.button.value * 60 * 60 * 1000),
      });
      await handleRosterOrOrphanedRecordsModified();
    } catch (error) {
      dispatch(Modal.alert('Ignore Orphan', formatErrorMessage(error, 'Unable to ignore the record'))).then();
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

  const handleOrphanedRecordsUnitFilterChange = (event: ChangeEvent<{ name?: string, value: unknown }>) => {
    setOrphanedRecordsUnitFilter(event.target.value as string);
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
              { name: 'edipi', displayName: 'DoD ID' },
              { name: 'unit', displayName: 'Unit' },
              { name: 'phone', displayName: 'Phone' },
              { name: 'count', displayName: 'Count' },
              { name: 'earliestReportDate', displayName: 'First Report' },
              { name: 'latestReportDate', displayName: 'Latest Report' },
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
            onChangePage={handleOrphanedRecordsChangePage}
            onChangeRowsPerPage={handleOrphanedRecordsChangeRowsPerPage}
          />
        </TableContainer>

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
          <div className={classes.tableHeader}>
            <Button
              aria-label="Filters"
              className={classes.tableHeaderButton}
              onClick={() => setFiltersOpen(!filtersOpen)}
              size="small"
              startIcon={
                queryFilterState
                  ? <div className={classes.tableHeaderButtonCount}>{Object.keys(queryFilterState).length}</div>
                  : <FilterListIcon />
              }
              variant="outlined"
            >
              Filters
            </Button>
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
          </div>
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
          <QueryBuilder
            fields={rosterColumnInfos
              .map(column => {
                let items: QueryFieldPickListItem[] | undefined;
                if (column.name === 'unit') {
                  items = units.map(({ id, name }) => ({ label: name, value: id }));
                } else if (column.type === ApiRosterColumnType.Enum) {
                  const options = (column.config as ApiRosterEnumColumnConfig)?.options?.slice() ?? [];
                  options.unshift({ id: '', label: '' });
                  items = options.map(({ id, label }) => ({ label, value: id }));
                } else {
                  items = undefined;
                }
                return {
                  items,
                  displayName: column.displayName,
                  name: column.name,
                  type: column.type as unknown as QueryFieldType,
                };
              })}
            onChange={setQueryFilterState}
            open={filtersOpen}
            persistKey="rosterQuery"
          />
          <div className={classes.tableWrapper}>
            <TableCustomColumnsContent
              rows={rows}
              columns={visibleColumns}
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
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </div>
        </TableContainer>
      </Container>
      {editRosterEntryDialogProps.open && (
        <EditRosterEntryDialog {...editRosterEntryDialogProps} />
      )}
    </main>
  );
};
