import {
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Menu,
  MenuItem,
  Paper,
  TableContainer,
} from '@material-ui/core';
import BackupIcon from '@material-ui/icons/Backup';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import React, {
  ChangeEvent, MouseEvent, useCallback, useEffect, useRef, useState,
} from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { AppFrame } from '../../../actions/app-frame.actions';
import { Roster } from '../../../actions/roster.actions';
import { downloadFile } from '../../../utility/download';
import { getNewPageIndex } from '../../../utility/table';
import PageHeader from '../../page-header/page-header';
import { SortDirection, TableColumn, TableCustomColumnsContent } from '../../tables/table-custom-columns-content';
import { TablePagination } from '../../tables/table-pagination/table-pagination';
import useStyles from './roster-page.styles';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import {
  ApiRosterColumnInfo,
  ApiRosterColumnType,
  ApiRosterEnumColumnConfig,
  ApiRosterEntry,
  ApiRosterPaginated,
} from '../../../models/api-response';
import { EditRosterEntryDialog, EditRosterEntryDialogProps } from './edit-roster-entry-dialog';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { Unit } from '../../../actions/unit.actions';
import { UnitSelector } from '../../../selectors/unit.selector';
import {
  QueryBuilder, QueryFieldPickListItem, QueryFieldType, QueryFilterState,
} from '../../query-builder/query-builder';
import { formatMessage } from '../../../utility/errors';
import { ButtonSet } from '../../buttons/button-set';
import { DataExportIcon } from '../../icons/data-export-icon';
import { Modal } from '../../../actions/modal.actions';

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
  const fileInputRef = React.createRef<HTMLInputElement>();

  const maxNumColumnsToShow = 5;

  const [rows, setRows] = useState<ApiRosterEntry[]>([]);
  const [page, setPage] = useState(0);
  const initialLoad = useRef(true);
  const [totalRowsCount, setTotalRowsCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [unitNameMap, setUnitNameMap] = useState<{[key: string]: string}>({});
  const [selectedRosterEntry, setSelectedRosterEntry] = useState<ApiRosterEntry>();
  const [deleteRosterEntryDialogOpen, setDeleteRosterEntryDialogOpen] = useState(false);
  const [editRosterEntryDialogProps, setEditRosterEntryDialogProps] = useState<EditRosterEntryDialogProps>({ open: false });
  const [deleteRosterEntryLoading, setDeleteRosterEntryLoading] = useState(false);
  const [rosterEntryEndDateLoading, setRosterEntryEndDateLoading] = useState(false);
  const [downloadTemplateLoading, setDownloadTemplateLoading] = useState(false);
  const [exportRosterLoading, setExportRosterLoading] = useState(false);
  const [queryFilterState, setQueryFilterState] = useState<QueryFilterState>();
  const [sortState, setSortState] = useState<SortState>();
  const [rosterColumnInfos, setRosterColumnInfos] = useState<ApiRosterColumnInfo[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<ApiRosterColumnInfo[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleColumnsMenuOpen, setVisibleColumnsMenuOpen] = useState(false);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const visibleColumnsButtonRef = useRef<HTMLDivElement>(null);
  const orgId = useSelector<AppState, UserState>(state => state.user).activeRole?.role.org?.id;
  const orgName = useSelector<AppState, UserState>(state => state.user).activeRole?.role.org?.name;

  //
  // Effects
  //

  const reloadTable = useCallback(async () => {
    try {
      const params: {[key: string]: string} = {
        limit: `${rowsPerPage}`,
        page: `${page}`,
      };
      if (sortState) {
        params.orderBy = sortState.column;
        params.sortDirection = sortState.sortDirection;
      }
      if (queryFilterState) {
        setApplyingFilters(true);
        setTotalRowsCount(0);
        const response = await axios.post(`api/roster/${orgId}/search`, queryFilterState, {
          params,
        });
        const data = response.data as ApiRosterPaginated;
        setRows(data.rows);
        setTotalRowsCount(data.totalRowsCount);
        setApplyingFilters(false);
      } else {
        const response = await axios(`api/roster/${orgId}`, {
          params,
        });
        const data = response.data as ApiRosterPaginated;
        setRows(data.rows);
        setTotalRowsCount(data.totalRowsCount);
      }
    } catch (e) {
      dispatch(Modal.alert('Error', formatMessage(e, 'Error Applying Filters')));
    }
  }, [dispatch, page, rowsPerPage, orgId, queryFilterState, sortState]);

  const initializeRosterColumnInfo = useCallback(async () => {
    try {
      const infos = (await axios.get(`api/roster/${orgId}/info`)).data as ApiRosterColumnInfo[];
      const unitColumnWithInfos = sortRosterColumns([unitColumn, ...infos]);
      setRosterColumnInfos(unitColumnWithInfos);
      if (initialLoad.current) {
        setVisibleColumns(unitColumnWithInfos.slice(0, maxNumColumnsToShow));
      }
    } catch (error) {
      dispatch(Modal.alert('Get Roster Column Info', formatMessage(error, 'Failed to get roster column info')));
    }
  }, [dispatch, orgId]);

  const initializeTable = useCallback(async () => {
    dispatch(AppFrame.setPageLoading(initialLoad.current));
    if (orgId) {
      await dispatch(Unit.fetch(orgId));
    }
    await initializeRosterColumnInfo();
    await reloadTable();
    dispatch(AppFrame.setPageLoading(false));
    initialLoad.current = false;
  }, [dispatch, orgId, initializeRosterColumnInfo, reloadTable]);

  const sortRosterColumns = (columns: ApiRosterColumnInfo[]) => {
    const columnPriority: {
      [key: string]: number | undefined,
      default: number,
    } = {
      edipi: 1,
      firstName: 2,
      lastName: 3,
      unit: 4,
      lastReported: 5,
      default: 6,
    };
    return columns.sort((a: ApiRosterColumnInfo, b: ApiRosterColumnInfo) => {
      return (columnPriority[a.name] || columnPriority.default) - (columnPriority[b.name] || columnPriority.default);
    });
  };

  useEffect(() => {
    const unitNames: { [key: string]: string } = {};
    for (const unit of units) {
      unitNames[unit.id] = unit.name;
    }
    setUnitNameMap(unitNames);
  }, [units]);

  useEffect(() => {
    initializeTable().then();
  }, [initializeTable]);

  //
  // Functions
  //

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

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files[0] == null) {
      return;
    }

    dispatch(Roster.upload(e.target.files[0], async (response, message) => {
      // reset the file input so that onChange fires again on repeat uploads of the same file.
      fileInputRef.current!.value = '';
      if (response.errors?.length || message) {
        let msg = message || 'Please verify the roster data.';

        (response.errors ?? []).forEach(error => {
          const line = error.line ? `Line: ${error.line}` : undefined;
          msg += '<br/>';
          if (line) {
            msg += `<em>${line}${error.column ? `, Column: ${error.column}` : ''}</em> - `;
          }
          msg += error.error;
        });

        dispatch(Modal.alert('Upload Error', msg));
      } else {
        dispatch(Modal.alert('Upload Successful', `Successfully uploaded ${response.count} roster entries.`));
        await initializeTable();
      }
    }));
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

  const editButtonClicked = async (rosterEntry: ApiRosterEntry) => {
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterColumnInfos,
      rosterEntry,
      onClose: async () => {
        setEditRosterEntryDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        dispatch(Modal.alert('Edit Roster Entry', `Unable to edit roster entry: ${message}`));
      },
    });
  };

  const addButtonClicked = async () => {
    setEditRosterEntryDialogProps({
      open: true,
      orgId,
      rosterColumnInfos,
      onClose: async () => {
        setEditRosterEntryDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        dispatch(Modal.alert('Add Roster Entry', `Unable to add roster entry: ${message}`));
      },
    });
  };

  const deleteAllClicked = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (confirm('This will permanently delete ALL roster entries?')) {
      await dispatch(Roster.deleteAll(orgId!));
      await initializeTable();
    }
  };

  const deleteButtonClicked = (rosterEntry: ApiRosterEntry) => {
    setSelectedRosterEntry(rosterEntry);
    setDeleteRosterEntryDialogOpen(true);
  };

  const setRosterEntryEndDate = async () => {
    try {
      setRosterEntryEndDateLoading(true);
      await axios.put(`api/roster/${orgId}/${selectedRosterEntry!.id}`, {
        endDate: moment().subtract(1, 'day').toISOString(),
      });
    } catch (error) {
      dispatch(Modal.alert('Remove Roster Entry', formatMessage(error, 'Unable to set end date for roster entry')));
    } finally {
      setRosterEntryEndDateLoading(false);
      setDeleteRosterEntryDialogOpen(false);
      setSelectedRosterEntry(undefined);
      await initializeTable();
    }
  };

  const deleteRosterEntry = async () => {
    try {
      setDeleteRosterEntryLoading(true);
      await axios.delete(`api/roster/${orgId}/${selectedRosterEntry!.id}`);
    } catch (error) {
      dispatch(Modal.alert('Delete Roster Entry', formatMessage(error, 'Unable to delete roster entry')));
    } finally {
      setDeleteRosterEntryLoading(false);
      setDeleteRosterEntryDialogOpen(false);
      setSelectedRosterEntry(undefined);
      await initializeTable();
    }
  };

  const cancelDeleteRosterEntryDialog = () => {
    setDeleteRosterEntryDialogOpen(false);
    setSelectedRosterEntry(undefined);
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
      dispatch(Modal.alert('Roster CSV Export', formatMessage(error, 'Unable to export roster to CSV')));
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
      dispatch(Modal.alert('CSV Template Download', formatMessage(error, 'Unable to download CSV template')));
    } finally {
      setDownloadTemplateLoading(false);
    }
  };

  //
  // Render
  //

  return (
    <main className={classes.root}>
      <Container maxWidth={false}>
        <PageHeader title="Roster" />

        <ButtonSet>
          <input
            accept="text/csv"
            id="raised-button-file"
            type="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
          <label htmlFor="raised-button-file">
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
            type="button"
            size="large"
            variant="text"
            startIcon={<CloudDownloadIcon />}
            onClick={() => downloadCSVTemplate()}
            loading={downloadTemplateLoading}
          >
            Download CSV Template
          </ButtonWithSpinner>

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

          <Button
            color="primary"
            size="large"
            variant="text"
            startIcon={<PersonAddIcon />}
            onClick={addButtonClicked}
          >
            Add Individual
          </Button>

          <Button
            color="primary"
            size="large"
            variant="text"
            startIcon={<DeleteSweepIcon />}
            onClick={deleteAllClicked}
          >
            Delete All
          </Button>
        </ButtonSet>

        <TableContainer component={Paper}>
          <div className={classes.secondaryButtons}>
            <Button
              aria-label="Filters"
              className={classes.secondaryButton}
              onClick={() => setFiltersOpen(!filtersOpen)}
              size="small"
              startIcon={queryFilterState ? <div className={classes.secondaryButtonCount}>{Object.keys(queryFilterState).length}</div> : <FilterListIcon />}
              variant="outlined"
            >
              Filters
            </Button>
            <Button
              aria-label="Visible columns"
              className={classes.secondaryButton}
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
          />
          <div className={classes.tableWrapper}>
            <TableCustomColumnsContent
              rows={rows}
              columns={visibleColumns}
              sortable
              onSortChange={handleSortChanged}
              idColumn="id"
              noDataText={applyingFilters ? 'Searching...' : 'No Data'}
              rowOptions={{
                menuItems: [{
                  name: 'Edit Entry',
                  callback: editButtonClicked,
                }, {
                  name: 'Delete Entry',
                  callback: deleteButtonClicked,
                }],
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
      {deleteRosterEntryDialogOpen && (
        <Dialog
          open={deleteRosterEntryDialogOpen}
          onClose={cancelDeleteRosterEntryDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Remove Individual</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Is the removal of this individual a correction, or is the individual no longer part of the group?
            </DialogContentText>
          </DialogContent>
          <DialogActions className={classes.deleteDialogActions}>
            <ButtonWithSpinner onClick={deleteRosterEntry} loading={deleteRosterEntryLoading}>
              This is a Correction
            </ButtonWithSpinner>
            <ButtonWithSpinner onClick={setRosterEntryEndDate} loading={rosterEntryEndDateLoading}>
              Individual Left Group
            </ButtonWithSpinner>
            <Button variant="outlined" onClick={cancelDeleteRosterEntryDialog}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {editRosterEntryDialogProps.open && (
        <EditRosterEntryDialog {...editRosterEntryDialogProps} />
      )}
    </main>
  );
};
