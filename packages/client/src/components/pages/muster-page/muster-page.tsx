import MomentUtils from '@date-io/moment';
import {
  Box,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  TableContainer,
} from '@material-ui/core';
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import React, {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  ColumnInfo,
  ColumnType,
} from '@covid19-reports/shared';
import { downloadFile } from '../../../utility/download';
import {
  getMaxPageIndex,
  getNewPageIndex,
  columnInfosOrdered,
} from '../../../utility/table';
import PageHeader from '../../page-header/page-header';
import { ColumnInfoToTableColumns, TableCustomColumnsContent } from '../../tables/table-custom-columns-content';
import { TablePagination } from '../../tables/table-pagination/table-pagination';
import { MusterPageHelp } from './muster-page-help';
import useStyles from './muster-page.styles';
import {
  ApiMusterRosterEntriesPaginated,
} from '../../../models/api-response';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { UnitSelector } from '../../../selectors/unit.selector';
import { Unit } from '../../../actions/unit.actions';
import { DataExportIcon } from '../../icons/data-export-icon';
import { Modal } from '../../../actions/modal.actions';
import { formatErrorMessage } from '../../../utility/errors';
import { UserSelector } from '../../../selectors/user.selector';
import usePersistedState from '../../../hooks/use-persisted-state';
import { ExportClient } from '../../../client/export.client';
import { MusterClient } from '../../../client/muster.client';
import { RosterClient } from '../../../client/roster.client';
import { AppFrameActions } from '../../../slices/app-frame.slice';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { UnitMusterComplianceTable } from './table-unit-muster-compliance';
import { ReportSchemaSelector } from '../../../selectors/report-schema.selector';
import { SavedFilterSelector } from '../../../selectors/saved-filter.selector';
import { SavedFilter } from '../../../actions/saved-filter.actions';
import { ReportSchema } from '../../../actions/report-schema.actions';

export const MusterPage = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const units = useAppSelector(UnitSelector.all);
  const reports = useAppSelector(ReportSchemaSelector.all);
  const filters = useAppSelector(SavedFilterSelector.rosterEntry);
  const user = useAppSelector(state => state.user);
  const org = useAppSelector(UserSelector.org)!;
  const isPageLoading = useAppSelector(state => state.appFrame.isPageLoading);

  const maxNumColumnsToShow = 6;

  const [rosterSelectedTimeRangeIndex, setRosterSelectedTimeRangeIndex] = usePersistedState('musterRosterSelectedTimeRangeIndex', 0);
  const [rosterFromDateIso, setRosterFromDateIso] = usePersistedState('musterRosterFromDateIso', moment().startOf('day').toISOString());
  const [rosterToDateIso, setRosterToDateIso] = usePersistedState('musterRosterToDateIso', moment().endOf('day').toISOString());
  const [filterId, setFilterId] = usePersistedState('musterFilterId', -1);
  const [reportId, setReportId] = usePersistedState('musterReportId', 'es6ddssymptomobs');
  const [rosterPage, setRosterPage] = useState(0);
  const [rosterRowsPerPage, setRosterRowsPerPage] = usePersistedState('musterRosterRowsPerPage', 10);
  const [exportLoading, setExportLoading] = useState(false);
  const [rosterColumnInfos, setRosterColumnInfos] = useState<ColumnInfo[]>([]);
  const [rosterData, setRosterData] = useState<ApiMusterRosterEntriesPaginated>({
    rows: [],
    totalRowsCount: 0,
  });

  const timeRanges: Readonly<Readonly<TimeRange>[]> = useMemo(() => ([
    {
      label: 'Today',
      getRange: () => ({
        fromDateIso: moment().startOf('day').toISOString(),
        toDateIso: moment().endOf('day').toISOString(),
      }),
    },
    {
      label: 'Yesterday',
      getRange: () => ({
        fromDateIso: moment().subtract(1, 'day').startOf('day').toISOString(),
        toDateIso: moment().subtract(1, 'day').endOf('day').toISOString(),
      }),
    },
    {
      label: 'Last 2 Days',
      getRange: () => ({
        fromDateIso: moment().subtract(2, 'day').startOf('day').toISOString(),
        toDateIso: moment().subtract(1, 'day').endOf('day').toISOString(),
      }),
    },
    {
      label: 'Last 3 Days',
      getRange: () => ({
        fromDateIso: moment().subtract(3, 'day').startOf('day').toISOString(),
        toDateIso: moment().subtract(1, 'day').endOf('day').toISOString(),
      }),
    },
    {
      label: 'Last 4 Days',
      getRange: () => ({
        fromDateIso: moment().subtract(4, 'day').startOf('day').toISOString(),
        toDateIso: moment().subtract(1, 'day').endOf('day').toISOString(),
      }),
    },
    {
      label: 'Last 5 Days',
      getRange: () => ({
        fromDateIso: moment().subtract(5, 'day').startOf('day').toISOString(),
        toDateIso: moment().subtract(1, 'day').endOf('day').toISOString(),
      }),
    },
    {
      label: 'Custom',
      getRange: () => ({
        fromDateIso: rosterFromDateIso,
        toDateIso: rosterToDateIso,
      }),
    },
  ]), [rosterFromDateIso, rosterToDateIso]);

  const customTimeRangeIndex = timeRanges.length - 1;

  //
  // Effects
  //

  const getResources = useCallback(async () => {
    if (org.id) {
      await Promise.all([
        dispatch(Unit.fetch(org.id)),
        dispatch(SavedFilter.fetch(org.id, 'roster')),
        dispatch(ReportSchema.fetch(org.id)),
      ]);
    }
  }, [org, dispatch]);

  const showErrorDialog = useCallback((title: string, error: Error) => {
    void dispatch(Modal.alert(`Error: ${title}`, formatErrorMessage(error)));
  }, [dispatch]);

  const reloadTable = useCallback(async () => {
    if (reportId === '') {
      return;
    }
    let data: ApiMusterRosterEntriesPaginated;
    try {
      data = await MusterClient.getRosterMusterComplianceByDateRange(org.id, {
        fromDate: rosterFromDateIso,
        toDate: rosterToDateIso,
        filterId: filterId >= 0 ? `${filterId}` : undefined,
        reportId,
        page: `${rosterPage}`,
        limit: `${rosterRowsPerPage}`,
      });
    } catch (error) {
      showErrorDialog('Get Roster Muster', error);
      throw error;
    }

    // If our current page is now out of range, put us on the last page for this new data.
    // Switching pages will force a reload of the table data, and we don't want to show anything in the meantime,
    // so only set the new individuals data here if our page is valid.
    const maxPageIndex = getMaxPageIndex(rosterRowsPerPage, data.totalRowsCount);
    if (rosterPage > maxPageIndex) {
      setRosterPage(maxPageIndex);
    } else {
      setRosterData(data);
    }
  }, [rosterFromDateIso, rosterToDateIso, rosterRowsPerPage, rosterPage, org, reportId, filterId, showErrorDialog]);

  useEffect(() => {
    void reloadTable();
  }, [reloadTable]);

  const initializeRosterColumnInfo = useCallback(async () => {
    try {
      const infos = await RosterClient.getAllowedRosterColumnsInfo(org.id);
      setRosterColumnInfos(infos);
    } catch (error) {
      showErrorDialog('Get Roster Info', error.message);
    }
  }, [org, showErrorDialog]);

  const initialize = useCallback(async () => {
    dispatch(AppFrameActions.setPageLoading({ isLoading: true }));

    try {
      await Promise.all([
        initializeRosterColumnInfo(),
        getResources(),
      ]);

      // Make sure non-custom time ranges like Today/Yesterday/etc override persisted dates.
      const range = timeRanges[rosterSelectedTimeRangeIndex].getRange();
      setRosterFromDateIso(range.fromDateIso);
      setRosterToDateIso(range.toDateIso);
    } finally {
      dispatch(AppFrameActions.setPageLoading({ isLoading: false }));
    }
  }, [dispatch, initializeRosterColumnInfo, getResources, timeRanges, rosterSelectedTimeRangeIndex, setRosterFromDateIso, setRosterToDateIso]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  //
  // Functions
  //

  const handleRosterChangePage = (event: MouseEvent<HTMLButtonElement> | null, pageNew: number) => {
    setRosterPage(pageNew);
  };

  const handleRosterChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rosterRowsPerPageNew = parseInt(event.target.value);
    const rosterPageNew = getNewPageIndex(rosterRowsPerPage, rosterPage, rosterRowsPerPageNew);
    setRosterRowsPerPage(rosterRowsPerPageNew);
    setRosterPage(rosterPageNew);
  };

  const downloadCSVExport = async () => {
    try {
      setExportLoading(true);
      const data = await ExportClient.exportMusterRosterToCsv(org.id, {
        fromDate: rosterFromDateIso,
        toDate: rosterToDateIso,
        filterId: filterId >= 0 ? `${filterId}` : undefined,
        reportId,
      });

      const fromDateStr = moment(rosterFromDateIso).format('YYYY-MM-DD_h-mm-a');
      const toDateStr = moment(rosterToDateIso).format('YYYY-MM-DD_h-mm-a');
      const filter = filterId >= 0 ? _.kebabCase(filters.find(f => f.id === filterId)!.name) : 'full-roster';
      const filename = `${_.kebabCase(org.name)}_${filter}_muster-compliance_${fromDateStr}_to_${toDateStr}`;
      downloadFile(data, filename, 'csv');
    } catch (error) {
      void dispatch(Modal.alert('Export to CSV', formatErrorMessage(error, 'Unable to export')));
    } finally {
      setExportLoading(false);
    }
  };

  const getVisibleColumns = () => {
    const customRosterColumnInfos: ColumnInfo[] = [
      ...rosterColumnInfos,
      {
        name: 'unitId',
        displayName: 'Unit',
        type: ColumnType.String,
        pii: false,
        phi: false,
        custom: false,
        required: false,
        updatable: false,
        config: {},
      },
      {
        name: 'musterPercent',
        displayName: 'Muster Rate',
        type: ColumnType.String,
        pii: false,
        phi: false,
        custom: false,
        required: false,
        updatable: false,
        config: {},
      },
    ];

    // HACK: The phone number might already exist in custom columns, but we're also returning it manually
    // for muster data to merge ES data with roster data. So trim out any possible existing phone columns
    // before adding our special case one.
    const filteredCustomRosterColumnInfos = customRosterColumnInfos.filter(x => x.name.toLowerCase().indexOf('phone') === -1);
    filteredCustomRosterColumnInfos.push({
      name: 'phone',
      displayName: 'Phone',
      type: ColumnType.String,
      pii: true,
      phi: false,
      custom: true,
      required: false,
      updatable: false,
      config: {},
    });

    return columnInfosOrdered(filteredCustomRosterColumnInfos, [
      'edipi',
      'firstName',
      'lastName',
      'phone',
      'unitId',
      'musterPercent',
    ]).slice(0, maxNumColumnsToShow);
  };

  const handleFilterChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const id = event.target.value as number;
    setFilterId(id);
  };

  const handleReportChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const id = event.target.value as string;
    setReportId(id);
  };

  const handleRosterFromDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return;
    }

    setRosterFromDateIso(date.toISOString());
    setRosterSelectedTimeRangeIndex(customTimeRangeIndex);
  };

  const handleRosterToDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return;
    }

    setRosterToDateIso(date.toISOString());
    setRosterSelectedTimeRangeIndex(customTimeRangeIndex);
  };

  const handleRosterSelectedTimeRangeChange = (e: ChangeEvent<{ value: unknown }>) => {
    const index = parseInt(e.target.value as string);
    const range = timeRanges[index].getRange();

    setRosterSelectedTimeRangeIndex(index);
    setRosterFromDateIso(range.fromDateIso);
    setRosterToDateIso(range.toDateIso);
  };

  //
  // Render
  //

  return (
    <main className={classes.root}>
      <Container maxWidth={false}>
        <PageHeader
          title="Muster Compliance"
          help={{
            contentComponent: MusterPageHelp,
            cardId: 'musterPage',
          }}
        />

        <Grid container spacing={3}>
          {/* Table */}
          {user.activeRole?.role.canViewPII && (
            <Grid item xs={12}>
              <Paper>
                <TableContainer>
                  <Box display="flex">
                    <Box display="flex" flexWrap="wrap">
                      <Box className={classes.tableHeaderControls}>
                        <Box fontWeight="bold" marginBottom={1}>
                          <span>Time Range</span>

                          <Select
                            className={classes.timeRangeSelect}
                            value={rosterSelectedTimeRangeIndex}
                            onChange={handleRosterSelectedTimeRangeChange}
                          >
                            {timeRanges.map((timeRange, index) => (
                              <MenuItem key={index} value={index}>
                                {timeRange.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>

                        <Box display="flex" alignItems="center">
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DateTimePicker
                              id="from-date"
                              format="M/D/YY h:mm A"
                              placeholder="mm/dd/yy hh:mm:ss"
                              value={rosterFromDateIso}
                              maxDate={rosterToDateIso}
                              onChange={handleRosterFromDateChange}
                              inputProps={{
                                size: 17,
                              }}
                            />
                          </MuiPickersUtilsProvider>

                          <Box marginX={1}>to</Box>

                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DateTimePicker
                              id="to-date"
                              format="M/D/YY h:mm A"
                              placeholder="mm/dd/yy hh:mm:ss"
                              value={rosterToDateIso}
                              minDate={rosterFromDateIso}
                              maxDate={moment()}
                              onChange={handleRosterToDateChange}
                              inputProps={{
                                size: 17,
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </Box>
                      </Box>

                      {reports && reports.length > 0 && (
                        <Box className={classes.tableHeaderControls}>
                          <Box fontWeight="bold" marginBottom={1}>
                            <label>Report Type</label>
                          </Box>

                          <Box display="flex" alignItems="center">
                            <Select
                              value={reportId}
                              displayEmpty
                              onChange={handleReportChange}
                            >
                              {reports.map(report => (
                                <MenuItem key={report.id} value={report.id}>
                                  {report.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </Box>
                        </Box>
                      )}

                      {filters && filters.length > 0 && (
                        <Box className={classes.tableHeaderControls}>
                          <Box fontWeight="bold" marginBottom={1}>
                            <label>Filter</label>
                          </Box>

                          <Box display="flex" alignItems="center">
                            <Select
                              value={filterId}
                              displayEmpty
                              onChange={handleFilterChange}
                            >
                              <MenuItem key={-1} value={-1}>
                                <em>Full Roster</em>
                              </MenuItem>

                              {filters.map(filter => (
                                <MenuItem key={filter.id} value={filter.id}>
                                  {filter.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Box
                      className={classes.tableHeaderControls}
                      flex={1}
                      display="flex"
                      alignItems="flex-start"
                      justifyContent="flex-end"
                    >
                      <ButtonWithSpinner
                        size="large"
                        variant="text"
                        color="primary"
                        startIcon={<DataExportIcon />}
                        onClick={() => downloadCSVExport()}
                        loading={exportLoading}
                      >
                        Export to CSV
                      </ButtonWithSpinner>
                    </Box>
                  </Box>

                  <TableCustomColumnsContent
                    rows={rosterData.rows}
                    columns={ColumnInfoToTableColumns(getVisibleColumns())}
                    idColumn="edipi"
                    noDataText={isPageLoading ? 'Loading...' : 'No Data'}
                    rowOptions={{
                      renderCell: (row, column) => {
                        const value = row[column.name];
                        if (column.name === 'unitId') {
                          return units.find(unit => unit.id === value)?.name || value;
                        }
                        if (column.name === 'musterPercent') {
                          return `${value.toFixed()}%`;
                        }
                        return value;
                      },
                    }}
                  />

                  <TablePagination
                    count={rosterData.totalRowsCount}
                    page={rosterPage}
                    rowsPerPage={rosterRowsPerPage}
                    rowsPerPageOptions={[10, 25, 50]}
                    onPageChange={handleRosterChangePage}
                    onRowsPerPageChange={handleRosterChangeRowsPerPage}
                  />
                </TableContainer>
              </Paper>
            </Grid>
          )}

          {/* Muster compliance Table */}
          {user.activeRole?.role.canViewPII && (
            <UnitMusterComplianceTable
              rosterFromDateIso={rosterFromDateIso}
              rosterToDateIso={rosterToDateIso}
              filterId={filterId}
              reportId={reportId}
            />
          )}
        </Grid>
      </Container>
    </main>
  );
};

type TimeRange = {
  label: string;
  getRange: () => {
    fromDateIso: string;
    toDateIso: string;
  };
};

