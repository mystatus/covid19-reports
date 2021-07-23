import MomentUtils from '@date-io/moment';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  TableContainer,
  Typography,
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
import { RosterColumnType } from '@covid19-reports/shared';
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
  ApiMusterTrends,
  ApiRosterColumnInfo,
  ApiUnitStatsByDate,
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
  const maxTopUnitsCount = 5;
  const trendChart = {
    layout: {
      height: 320,
      autosize: true,
      barmode: 'stack',
      yaxis: {
        title: 'Non-Muster Rate %',
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

  const weeklyTrendChart = {
    ...trendChart,
  };

  const monthlyTrendChart = {
    ...trendChart,
  };

  const [rosterSelectedTimeRangeIndex, setRosterSelectedTimeRangeIndex] = usePersistedState('musterRosterSelectedTimeRangeIndex', 0);
  const [rosterFromDateIso, setRosterFromDateIso] = usePersistedState('musterRosterFromDateIso', moment().startOf('day').toISOString());
  const [rosterToDateIso, setRosterToDateIso] = usePersistedState('musterRosterToDateIso', moment().endOf('day').toISOString());
  const [rosterUnitId, setRosterUnitId] = usePersistedState('musterRosterUnitId', -1);
  const [rosterPage, setRosterPage] = useState(0);
  const [rosterRowsPerPage, setRosterRowsPerPage] = usePersistedState('musterRosterRowsPerPage', 10);
  const [exportLoading, setExportLoading] = useState(false);
  const [rosterColumnInfos, setRosterColumnInfos] = useState<ApiRosterColumnInfo[]>([]);
  const [rawTrendData, setRawTrendData] = useState<ApiMusterTrends>({ weekly: {}, monthly: {} });
  const [weeklyTrendTopUnitCount, setWeeklyTrendTopUnitCount] = usePersistedState('musterWeeklyTrendTopUnitCount', 5);
  const [monthlyTrendTopUnitCount, setMonthlyTrendTopUnitCount] = usePersistedState('musterMonthlyTrendTopUnitCount', 5);
  const [weeklyTrendData, setWeeklyTrendData] = useState<Plotly.Data[]>([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState<Plotly.Data[]>([]);
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
    dispatch(Modal.alert(`Error: ${title}`, formatErrorMessage(error))).then();
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

  const reloadTrendData = useCallback(async () => {
    try {
      const data = await MusterClient.getMusterUnitTrends(orgId, {
        currentDate: moment().toISOString(),
        weeksCount: '6',
        monthsCount: '6',
      });
      setRawTrendData(data);
    } catch (error) {
      showErrorDialog('Get Trends', error);
    }
  }, [orgId, showErrorDialog]);

  const initializeRosterColumnInfo = useCallback(async () => {
    try {
      const infos = await RosterClient.getAllowedRosterColumnsInfo(orgId);
      setRosterColumnInfos(infos);
    } catch (error) {
      showErrorDialog('Get Roster Info', error);
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
        reloadTrendData(),
      ]);

      // Make sure non-custom time ranges like Today/Yesterday/etc override persisted dates.
      const range = timeRanges[rosterSelectedTimeRangeIndex].getRange();
      setRosterFromDateIso(range.fromDateIso);
      setRosterToDateIso(range.toDateIso);
    } finally {
      dispatch(AppFrameActions.setPageLoading({ isLoading: false }));
    }
  }, [dispatch, initializeRosterColumnInfo, getUnits, reloadTable, reloadTrendData, timeRanges, rosterSelectedTimeRangeIndex, setRosterFromDateIso, setRosterToDateIso]);

  const getTrendData = useCallback((unitStatsByDate: ApiUnitStatsByDate, topUnitCount: number) => {
    // Sum up each unit's non-muster percent to figure out who's performing worst overall.
    const nonMusterPercentSumByUnit = {} as { [unitName: string]: number };
    for (const date of Object.keys(unitStatsByDate)) {
      for (const unitName of Object.keys(unitStatsByDate[date])) {
        if (nonMusterPercentSumByUnit[unitName] == null) {
          nonMusterPercentSumByUnit[unitName] = 0;
        }
        nonMusterPercentSumByUnit[unitName] += 100 - unitStatsByDate[date][unitName].musterPercent;
      }
    }

    // Exclude compliant units and sort with worst performing units first.
    const unitsSorted = Object.keys(nonMusterPercentSumByUnit)
      .filter(unitName => nonMusterPercentSumByUnit[unitName] > 0)
      .sort(unitName => nonMusterPercentSumByUnit[unitName])
      .reverse()
      .slice(0, topUnitCount);

    // Build chart data.
    const datesSorted = Object.keys(unitStatsByDate).sort();
    const trendChartData = [] as Plotly.Data[];
    for (const unitName of unitsSorted) {
      const chartData = {
        type: 'bar',
        x: datesSorted,
        y: [] as number[],
        name: unitName,
        hovertemplate: `%{y:.1f}%`,
      };

      for (const date of datesSorted) {
        const nonMusterPercent = 100 - unitStatsByDate[date][unitName].musterPercent;
        chartData.y.push(nonMusterPercent);
      }

      trendChartData.push(chartData as Plotly.Data);
    }

    return trendChartData;
  }, []);

  useEffect(() => {
    initialize().then();
  }, [initialize]);

  useEffect(() => {
    // Rebuild weekly chart data.
    const weeklyTrendDataNew = getTrendData(rawTrendData.weekly, weeklyTrendTopUnitCount);
    setWeeklyTrendData(weeklyTrendDataNew);
  }, [rawTrendData, weeklyTrendTopUnitCount, getTrendData]);

  useEffect(() => {
    // Rebuild monthly chart data.
    const monthlyTrendDataNew = getTrendData(rawTrendData.monthly, monthlyTrendTopUnitCount);
    setMonthlyTrendData(monthlyTrendDataNew);
  }, [rawTrendData, monthlyTrendTopUnitCount, getTrendData]);

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
      dispatch(Modal.alert('Export to CSV', formatErrorMessage(error, 'Unable to export'))).then();
    } finally {
      setExportLoading(false);
    }
  };

  const getVisibleColumns = () => {
    const customRosterColumnInfos: ApiRosterColumnInfo[] = [
      ...rosterColumnInfos,
      {
        name: 'unitId',
        displayName: 'Unit',
        type: RosterColumnType.String,
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
        type: RosterColumnType.String,
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
      type: RosterColumnType.String,
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

  const handleRosterUnitChange = (event: ChangeEvent<{ name?: string, value: unknown }>) => {
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
                    onChangeRowsPerPage={handleRosterChangeRowsPerPage}
                  />
                </TableContainer>
              </Paper>
            </Grid>
          )}

          {/* Weekly Non-Compliance */}
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Weekly Non-Compliance
                </Typography>

                <div>
                  <span>Viewing the top </span>
                  <Select
                    className={classes.trendCountSelect}
                    value={weeklyTrendTopUnitCount}
                    onChange={e => setWeeklyTrendTopUnitCount(parseInt(e.target.value as string))}
                  >
                    {Array.from(Array(maxTopUnitsCount).keys()).map(value => (
                      <MenuItem key={value} value={value + 1}>{value + 1}</MenuItem>
                    ))}
                  </Select>
                  <span> offending units.</span>
                </div>

                <Plot
                  style={{ width: '100%' }}
                  data={weeklyTrendData}
                  layout={weeklyTrendChart.layout}
                  config={weeklyTrendChart.config}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Non-Compliance */}
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Monthly Non-Compliance
                </Typography>

                <div>
                  <span>Viewing the top </span>
                  <Select
                    className={classes.trendCountSelect}
                    value={monthlyTrendTopUnitCount}
                    onChange={e => setMonthlyTrendTopUnitCount(parseInt(e.target.value as string))}
                  >
                    {Array.from(Array(maxTopUnitsCount).keys()).map(value => (
                      <MenuItem key={value} value={value + 1}>{value + 1}</MenuItem>
                    ))}
                  </Select>
                  <span> offending units.</span>
                </div>

                <Plot
                  style={{ width: '100%' }}
                  data={monthlyTrendData}
                  layout={monthlyTrendChart.layout}
                  config={monthlyTrendChart.config}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

type TimeRange = {
  label: string
  getRange: () => {
    fromDateIso: string
    toDateIso: string
  }
};
