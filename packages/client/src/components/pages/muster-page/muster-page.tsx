import MomentUtils from '@date-io/moment';
import {
  Box,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import * as Plotly from 'plotly.js';
import React, {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Plot from 'react-plotly.js';
import _ from 'lodash';
import moment from 'moment';
import { ColumnInfo, ColumnType } from '@covid19-reports/shared';
import { downloadFile } from '../../../utility/download';
import {
  getMaxPageIndex,
  getNewPageIndex,
  columnInfosOrdered,
} from '../../../utility/table';
import PageHeader from '../../page-header/page-header';
import { TableCustomColumnsContent } from '../../tables/table-custom-columns-content';
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

export const MusterPage = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const units = useAppSelector(UnitSelector.all);
  const user = useAppSelector(state => state.user);

  const maxNumColumnsToShow = 6;
  const trendChart = {
    layout: {
      height: 128,
      autosize: true,
      barmode: 'group',
      yaxis: {
        color: '#A9AEB1',
        hoverformat: '.0f%',
        showticklabels: false,
      },
      xaxis: {
        color: '#A9AEB1',
        hoverformat: '',
      },
      hovermode: 'closest',
      showlegend: false,
      colorway: ['#7776AF', '#54BEA5', '#E87779', '#EACC73', '#81B2DA'],
      margin: {
        l: 40,
        r: 20,
        b: 20,
        t: 20,
      },
    } as Partial<Plotly.Layout>,
    config: {
      displayModeBar: false,
    } as Partial<Plotly.Config>,
  };

  const complianceBarChart = {
    ...trendChart,
  };


  const [rosterSelectedTimeRangeIndex, setRosterSelectedTimeRangeIndex] = usePersistedState('musterRosterSelectedTimeRangeIndex', 0);
  const [rosterFromDateIso, setRosterFromDateIso] = usePersistedState('musterRosterFromDateIso', moment().startOf('day').toISOString());
  const [rosterToDateIso, setRosterToDateIso] = usePersistedState('musterRosterToDateIso', moment().endOf('day').toISOString());
  const [rosterUnitId, setRosterUnitId] = usePersistedState('musterRosterUnitId', -1);
  const [rosterPage, setRosterPage] = useState(0);
  const [rosterRowsPerPage, setRosterRowsPerPage] = usePersistedState('musterRosterRowsPerPage', 10);
  const [exportLoading, setExportLoading] = useState(false);
  const [rosterColumnInfos, setRosterColumnInfos] = useState<ColumnInfo[]>([]);
  const [unitComplianceData, setUnitComplianceData] = useState<Map<string, Plotly.Data[]>>(new Map());
  const [todaysUnitCompliance, setTodaysUnitCompliance] = useState<Map<string, number>>(new Map());
  const [overallUnitCompliance, setOverallUnitCompliance] = useState<Map<string, number>>(new Map());
  const [rosterData, setRosterData] = useState<ApiMusterRosterEntriesPaginated>({
    rows: [],
    totalRowsCount: 0,
  });

  const org = useAppSelector(UserSelector.org)!;
  const orgId = org.id;
  const orgName = org.name;
  const isPageLoading = useAppSelector(state => state.appFrame.isPageLoading);

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

  const getUnits = useCallback(async () => {
    if (orgId) {
      await dispatch(Unit.fetch(orgId));
    }
  }, [orgId, dispatch]);

  const showErrorDialog = useCallback((title: string, error: Error) => {
    void dispatch(Modal.alert(`Error: ${title}`, formatErrorMessage(error)));
  }, [dispatch]);

  const reloadTable = useCallback(async () => {
    let data: ApiMusterRosterEntriesPaginated;
    try {
      data = await MusterClient.getMusterRoster(orgId, {
        fromDate: rosterFromDateIso,
        toDate: rosterToDateIso,
        unitId: rosterUnitId >= 0 ? `${rosterUnitId}` : undefined,
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
  }, [rosterFromDateIso, rosterToDateIso, rosterRowsPerPage, rosterPage, orgId, rosterUnitId, showErrorDialog]);

  const reloadMusterComplianceData = useCallback(async () => {
    try {
      // determine if we are displaying for all units or just a single unit
      const unitsToDisplay = rosterUnitId === -1 ? units : [units.find(unit => unit.id === rosterUnitId)];
      const plotData = new Map();
      const overallComplianceData = new Map();
      const todaysComplianceData = new Map();
      for (let i = 0; i < unitsToDisplay.length; i++) {
        const unit = unitsToDisplay[i];
        const xRange: string[] = [];
        const yRange: number[] = [];
        let dayCount: number = 0;
        let totalCompliance: number = 0;
        if (unit) {
          const res = await MusterClient.getMusterComplianceByDateRange(orgId, unit.name, { isoStartDate: `${rosterFromDateIso}`, isoEndDate: `${rosterToDateIso}` });
          if (res.musterComplianceRates.length > 0) {
            res.musterComplianceRates.forEach(rate => {
              yRange.push(rate.musterComplianceRate);
              xRange.push(rate.isoDate);
              totalCompliance += rate.musterComplianceRate;
              dayCount += 1;
            });
            todaysComplianceData.set(unit.name, yRange[yRange.length - 1]);
            overallComplianceData.set(unit.name, totalCompliance / dayCount);
            plotData.set(unit.name, [{
              x: xRange,
              y: yRange,
              type: 'bar',
            },
            ]);
          }
        }
      }
      setTodaysUnitCompliance(todaysComplianceData);
      setOverallUnitCompliance(overallComplianceData);
      setUnitComplianceData(plotData);
    } catch (error) {
      showErrorDialog('Muster Trends', error);
    }
  }, [orgId, showErrorDialog, rosterUnitId, units, rosterFromDateIso, rosterToDateIso]);

  const initializeRosterColumnInfo = useCallback(async () => {
    try {
      const infos = await RosterClient.getAllowedRosterColumnsInfo(orgId);
      setRosterColumnInfos(infos);
    } catch (error) {
      showErrorDialog('Get Roster Info', error.message);
    }
  }, [orgId, showErrorDialog]);

  const initialize = useCallback(async () => {
    dispatch(AppFrameActions.setPageLoading({ isLoading: true }));

    try {
      await Promise.all([
        initializeRosterColumnInfo(),
        getUnits(),
      ]);

      await Promise.all([
        reloadTable(),
      ]);

      // Make sure non-custom time ranges like Today/Yesterday/etc override persisted dates.
      const range = timeRanges[rosterSelectedTimeRangeIndex].getRange();
      setRosterFromDateIso(range.fromDateIso);
      setRosterToDateIso(range.toDateIso);
    } finally {
      dispatch(AppFrameActions.setPageLoading({ isLoading: false }));
    }
  }, [dispatch, initializeRosterColumnInfo, getUnits, reloadTable, timeRanges, rosterSelectedTimeRangeIndex, setRosterFromDateIso, setRosterToDateIso]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    void reloadMusterComplianceData();
  }, [reloadMusterComplianceData]);


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
      const data = await ExportClient.exportMusterRosterToCsv(orgId, {
        fromDate: rosterFromDateIso,
        toDate: rosterToDateIso,
        unitId: rosterUnitId >= 0 ? `${rosterUnitId}` : undefined,
      });

      const fromDateStr = moment(rosterFromDateIso).format('YYYY-MM-DD_h-mm-a');
      const toDateStr = moment(rosterToDateIso).format('YYYY-MM-DD_h-mm-a');
      const unitId = rosterUnitId >= 0 ? `${rosterUnitId}` : 'all-units';
      const filename = `${_.kebabCase(orgName)}_${unitId}_muster-compliance_${fromDateStr}_to_${toDateStr}`;
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

  const handleRosterUnitChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const unitId = event.target.value as number;
    setRosterUnitId(unitId);
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

  const renderUnitComplianceTableRows = () => {
    const rows: any[] = [];
    unitComplianceData.forEach((value: Plotly.Data[], key: string) => {
      rows.push(
        <TableRow key={key}>
          <TableCell>
            {key}
          </TableCell>
          <TableCell align="right">
            { `${overallUnitCompliance.get(key)?.toFixed(2)}%` }
          </TableCell>
          <TableCell align="right">
            { `${todaysUnitCompliance.get(key)?.toFixed(2)}%` }
          </TableCell>
          <TableCell align="right">
            <Plot
              style={{ width: '100%' }}
              data={value}
              layout={complianceBarChart.layout}
              config={complianceBarChart.config}
            />
          </TableCell>
        </TableRow>,
      );
    });
    return rows;
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

                      <Box className={classes.tableHeaderControls}>
                        <Box fontWeight="bold" marginBottom={1}>
                          <label>Unit</label>
                        </Box>

                        <Box display="flex" alignItems="center">
                          <Select
                            value={rosterUnitId}
                            displayEmpty
                            onChange={handleRosterUnitChange}
                          >
                            <MenuItem value={-1}>
                              <em>All Units</em>
                            </MenuItem>

                            {units.map(unit => (
                              <MenuItem key={unit.id} value={unit.id}>
                                {unit.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
                      </Box>
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
                    columns={getVisibleColumns()}
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
            <Grid item xs={12}>
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Unit</TableCell>
                        <TableCell align="right">Overall Compliance</TableCell>
                        <TableCell align="right">Today&apos;s Compliance</TableCell>
                        <TableCell align="right">Daily Compliance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { renderUnitComplianceTableRows() }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
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
