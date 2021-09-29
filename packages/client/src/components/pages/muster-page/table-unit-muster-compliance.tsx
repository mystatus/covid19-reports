import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import * as Plotly from 'plotly.js';
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import Plot from 'react-plotly.js';

import { MusterComplianceByDate, oneDayMilliseconds } from '@covid19-reports/shared';
import moment from 'moment';
import { UnitSelector } from '../../../selectors/unit.selector';
import { Modal } from '../../../actions/modal.actions';
import { formatErrorMessage } from '../../../utility/errors';
import { UserSelector } from '../../../selectors/user.selector';
import { MusterClient } from '../../../client/muster.client';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';
import useStyles from './muster-page.styles';

export const UnitMusterComplianceTable = (props: any) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const units = useAppSelector(UnitSelector.all);
  const orgId = useAppSelector(UserSelector.org)!.id;
  const complianceBarChart = {
    layout: {
      autosize: true,
      barmode: 'group',
      yaxis: {
        color: '#A9AEB1',
        hoverformat: '.0f%',
        showticklabels: true,
        range: [0, 100],
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

  const [rosterFromDateIso, setRosterFromDateIso] = useState(props.rosterFromDateIso);
  const [rosterToDateIso, setRosterToDateIso] = useState(props.rosterToDateIso);
  const [filterId, setFilterId] = useState(props.filterId);
  const [reportId, setReportId] = useState(props.reportId);
  const [unitComplianceStats, setUnitComplianceStats] = useState<Map<string, ComplianceStats>>(new Map());
  const [unitCompliancePlotData, setUnitCompliancePlotData] = useState<Map<string, Plotly.Data[]>>(new Map());

  //
  // Callbacks
  //

  const showErrorDialog = useCallback((title: string, error: Error) => {
    void dispatch(Modal.alert(`Error: ${title}`, formatErrorMessage(error)));
  }, [dispatch]);

  const reloadMusterComplianceData = useCallback(async () => {
    try {
      const unitComplianceData = await MusterClient.getMusterComplianceStatsByDateRange(orgId, {
        fromDate: rosterFromDateIso,
        toDate: rosterToDateIso,
        reportId,
        filterId,
      });
      const unitStats = new Map<number, MusterComplianceByDate[]>();
      for (const data of unitComplianceData.musterComplianceRates) {
        if (!unitStats.has(data.unit)) {
          unitStats.set(data.unit, []);
        }
        unitStats.get(data.unit)!.push(data);
      }
      const plotDataByUnit = new Map<string, Plotly.Data[]>();
      const complianceStatsByUnit = new Map<string, ComplianceStats>();
      const twoHoursMilliseconds = 2 * 60 * 60 * 1000;
      unitStats.forEach((stats, unitId) => {
        if (stats.length === 0) {
          return;
        }
        const unitName = units.find(u => u.id === unitId)?.name;
        if (!unitName) {
          return;
        }
        const xRange: string[] = [];
        const yRange: number[] = [];
        const colors: string[] = [];
        let minCompliance = 1.0;
        let maxCompliance = 0.0;
        let totalCompliance = 0.0;
        let minDate = Number.MAX_VALUE;
        let maxDate = Number.MIN_VALUE;
        const datesAdded: number[] = [];
        for (let i = 0; i < stats.length; i++) {
          if (stats[i].compliance < minCompliance) {
            minCompliance = stats[i].compliance;
          }
          if (stats[i].compliance > maxCompliance) {
            maxCompliance = stats[i].compliance;
          }
          totalCompliance += stats[i].compliance;
          xRange.push(stats[i].isoDate);
          yRange.push(stats[i].compliance * 100);
          colors.push('#7776AF');
          const date = moment(stats[i].isoDate).valueOf();
          datesAdded.push(date);
          if (minDate === null || date < minDate) {
            minDate = date;
          }
          if (maxDate === null || date > maxDate) {
            maxDate = date;
          }
        }
        for (let i = minDate; i < maxDate; i += oneDayMilliseconds) {
          // Using a two hour buffer on the milliseconds to account for any oddness with daylight savings time
          if (datesAdded.find(value => Math.abs(value - i) < twoHoursMilliseconds) == null) {
            xRange.push(moment(i).toISOString());
            yRange.push(100);
            colors.push('#DDDDDD');
          }
        }
        complianceStatsByUnit.set(unitName, {
          minCompliance: minCompliance * 100,
          maxCompliance: maxCompliance * 100,
          avgCompliance: (totalCompliance / stats.length) * 100,
        });
        plotDataByUnit.set(unitName, [{
          x: xRange,
          y: yRange,
          type: 'bar',
          marker: {
            color: colors,
          },
        }]);
      });
      setUnitComplianceStats(complianceStatsByUnit);
      setUnitCompliancePlotData(plotDataByUnit);
      // Sometimes the plot size is incorrect initially, trigger a resize event to update the sizes.
      setTimeout(() => window.dispatchEvent(new Event('resize')), 1000);
    } catch (error) {
      showErrorDialog('Muster Trends', error);
    }
  }, [showErrorDialog, orgId, units, filterId, reportId, rosterFromDateIso, rosterToDateIso]);

  //
  // Effects
  //

  useEffect(() => {
    setFilterId(props.filterId);
    setReportId(props.reportId);
    setRosterFromDateIso(props.rosterFromDateIso);
    setRosterToDateIso(props.rosterToDateIso);
  }, [props.filterId, props.reportId, props.rosterFromDateIso, props.rosterToDateIso]);

  useEffect(() => {
    void reloadMusterComplianceData();
  }, [reloadMusterComplianceData]);

  const renderUnitComplianceTableRows = () => {
    const rows: any[] = [];
    unitCompliancePlotData.forEach((value: Plotly.Data[], key: string) => {
      rows.push(
        <TableRow key={key} className={classes.complianceRow}>
          <TableCell>
            {key}
          </TableCell>
          <TableCell align="right">
            { `${unitComplianceStats.get(key)?.avgCompliance.toFixed(2)}%` }
          </TableCell>
          <TableCell align="right">
            { `${unitComplianceStats.get(key)?.minCompliance.toFixed(2)}%` }
          </TableCell>
          <TableCell align="right">
            { `${unitComplianceStats.get(key)?.maxCompliance.toFixed(2)}%` }
          </TableCell>
          <TableCell align="right">
            <Plot
              useResizeHandler
              style={{ width: '100%', height: '100%', maxHeight: '128px' }}
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
    <Grid item xs={12}>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Unit</TableCell>
                <TableCell align="right">Avg Compliance</TableCell>
                <TableCell align="right">Min Compliance</TableCell>
                <TableCell align="right">Max Compliance</TableCell>
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
  );
};

type ComplianceStats = {
  minCompliance: number;
  maxCompliance: number;
  avgCompliance: number;
};

