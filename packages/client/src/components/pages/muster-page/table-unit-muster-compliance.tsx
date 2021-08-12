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

import { UnitSelector } from '../../../selectors/unit.selector';
import { Modal } from '../../../actions/modal.actions';
import { formatErrorMessage } from '../../../utility/errors';
import { UserSelector } from '../../../selectors/user.selector';
import { MusterClient } from '../../../client/muster.client';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';

export const UnitMusterComplianceTable = (props: any) => {
  const dispatch = useAppDispatch();
  const units = useAppSelector(UnitSelector.all);
  const complianceBarChart = {
    layout: {
      height: 128,
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
  const [rosterUnitId, setRosterUnitId] = useState(props.rosterUnitId);
  const [unitComplianceData, setUnitComplianceData] = useState<Map<string, ComplianceData>>(new Map());
  const [unitCompliancePlotData, setUnitCompliancePlotData] = useState<Map<string, Plotly.Data[]>>(new Map());

  const orgId = useAppSelector(UserSelector.org)!.id;

  //
  // Effects
  //

  const showErrorDialog = useCallback((title: string, error: Error) => {
    void dispatch(Modal.alert(`Error: ${title}`, formatErrorMessage(error)));
  }, [dispatch]);

  const reloadMusterComplianceData = useCallback(async () => {
    try {
      console.log(units);
      console.log(rosterUnitId);
      console.log(rosterFromDateIso);
      // determine if we are displaying for all units or just a single unit
      const unitsToDisplay = rosterUnitId === -1 ? units : [units.find(unit => unit.id === rosterUnitId)];
      const plotData = new Map();
      const complianceDataByUnit = new Map();
      for (const unit of unitsToDisplay) {
        const xRange: string[] = [];
        const yRange: number[] = [];
        const colors: string[] = [];
        let dayCount: number = 0;
        let totalCompliance: number = 0;
        const complianceData: ComplianceData = {
          minCompliance: 100,
          maxCompliance: 0,
          avgCompliance: 0,
        };
        if (unit) {
          const res = await MusterClient.getMusterComplianceByDateRange(orgId, unit.name, { isoStartDate: `${rosterFromDateIso}`, isoEndDate: `${rosterToDateIso}` });
          if (res.musterComplianceRates.length > 0) {
            res.musterComplianceRates.forEach(rate => {
              const compliancePerc = rate.musterComplianceRate * 100;
              xRange.push(rate.isoDate);
              if (rate.musterComplianceRate !== null) {
                yRange.push(compliancePerc);
                colors.push('#7776AF');
                // update min compliance
                if (compliancePerc < complianceData.minCompliance) {
                  complianceData.minCompliance = compliancePerc;
                }
                // update max compliance
                if (compliancePerc > complianceData.maxCompliance) {
                  complianceData.maxCompliance = compliancePerc;
                }
                // update accumulators for setting compliance average
                totalCompliance += compliancePerc;
                dayCount += 1;
              } else {
                yRange.push(100);
                colors.push('#DDDDDD');
              }
            });
            complianceData.avgCompliance = totalCompliance / dayCount;
            complianceDataByUnit.set(unit.name, complianceData);
            plotData.set(unit.name, [{
              x: xRange,
              y: yRange,
              type: 'bar',
              marker: {
                color: colors,
              },
            },
            ]);
          }
        }
      }
      setUnitComplianceData(complianceDataByUnit);
      setUnitCompliancePlotData(plotData);
    } catch (error) {
      showErrorDialog('Muster Trends', error);
    }
  }, [orgId, showErrorDialog, rosterUnitId, units, rosterFromDateIso, rosterToDateIso]);

  useEffect(() => {
    setRosterUnitId(props.rosterUnitId);
    setRosterFromDateIso(props.rosterFromDateIso);
    setRosterToDateIso(props.rosterToDateIso);
  }, [props.rosterUnitId, props.rosterFromDateIso, props.rosterToDateIso]);

  useEffect(() => {
    void reloadMusterComplianceData();
  }, [reloadMusterComplianceData]);


  //
  // Functions
  //

  const renderUnitComplianceTableRows = () => {
    const rows: any[] = [];
    unitCompliancePlotData.forEach((value: Plotly.Data[], key: string) => {
      rows.push(
        <TableRow key={key}>
          <TableCell>
            {key}
          </TableCell>
          <TableCell align="right">
            { `${unitComplianceData.get(key)?.avgCompliance.toFixed(2)}%` }
          </TableCell>
          <TableCell align="right">
            { `${unitComplianceData.get(key)?.minCompliance.toFixed(2)}%` }
          </TableCell>
          <TableCell align="right">
            { `${unitComplianceData.get(key)?.maxCompliance.toFixed(2)}%` }
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

type ComplianceData = {
  minCompliance: number;
  maxCompliance: number;
  avgCompliance: number;
};

