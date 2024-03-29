import MomentUtils from '@date-io/moment';
import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
} from '@material-ui/core';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { Moment } from 'moment';
import React, {
  useState,
  useCallback,
} from 'react';
import { Modal } from '../../../actions/modal.actions';
import { ApiErrorResponseData } from '../../../models/api-response';
import { UserSelector } from '../../../selectors/user.selector';
import { downloadFile } from '../../../utility/download';
import { getLineCount } from '../../../utility/string-utils';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { LinearProgressWithPercent } from '../../linear-progress-with-label/linear-progress-with-label';
import PageHeader from '../../page-header/page-header';
import { DataExportPageHelp } from './data-export-page-help';
import useStyles from './data-export-page.styles';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';

export const DataExportPage = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const orgId = useAppSelector(UserSelector.orgId);

  const runExport = useCallback(async () => {
    setExportProgress(0);

    // Use fetch() here since axios doesn't support streaming.
    const queryParams = [];
    if (startDate) {
      queryParams.push(`startDate=${startDate.toISOString()}`);
    }
    if (endDate) {
      queryParams.push(`endDate=${endDate.toISOString()}`);
    }
    const response = await fetch(new Request(`api/export/${orgId}/sql?${queryParams.join('&')}`, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    }));

    if (response.status !== 200) {
      let message: string | undefined;
      try {
        const error = await response.json() as ApiErrorResponseData;
        message = error.errors[0].message;
      } finally {
        if (!message) {
          message = response.statusText;
        }
      }

      throw new Error(`Failed to export data: ${message}`);
    }

    const totalHits = parseInt(response.headers.get('total-hits')!);
    const maxHits = 1000000;
    if (totalHits >= maxHits) {
      throw new Error(`Document count (${totalHits.toLocaleString()}) is greater than the maximum allowed (${maxHits.toLocaleString()}). Please reduce the time range and try again.`);
    }

    const reader = response.body!.getReader();
    const textDecoder = new TextDecoder();
    let dataStr = '';
    let hitsRead = -1; // Offset for csv header line.
    let chunk = await reader.read();
    while (!chunk.done) {
      const chunkStr = textDecoder.decode(chunk.value);
      dataStr += chunkStr;

      hitsRead += getLineCount(chunkStr);
      setExportProgress((hitsRead / totalHits) * 100);

      chunk = await reader.read();
    }

    downloadFile(dataStr, 'export', 'csv');
  }, [orgId, startDate, endDate]);

  const handleExportButtonClick = async () => {
    setIsExportLoading(true);

    try {
      await runExport();
    } catch (err) {
      void dispatch(Modal.alert('Export Failed', err.message));
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <PageHeader
          title="Data Export"
          help={{
            contentComponent: DataExportPageHelp,
            cardId: 'dataExportPage',
          }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={10} lg={8}>
            <Paper>
              <Box padding={3}>
                <Box className={classes.dateRange}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      className={classes.startDate}
                      label="Start Date"
                      value={startDate}
                      onChange={setStartDate}
                      maxDate={endDate ?? new Date()}
                      format="MM/DD/YYYY"
                      placeholder="Earliest"
                    />
                  </MuiPickersUtilsProvider>

                  <Box className={classes.to}>
                    to
                  </Box>

                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      className={classes.endDate}
                      label="End Date"
                      value={endDate}
                      onChange={setEndDate}
                      minDate={startDate ?? undefined}
                      maxDate={new Date()}
                      format="MM/DD/YYYY"
                      placeholder="Latest"
                    />
                  </MuiPickersUtilsProvider>
                </Box>

                <Box my={3}>
                  <Divider />
                </Box>

                <Box display="flex" alignItems="center">
                  <Box mr={3}>
                    <ButtonWithSpinner
                      onClick={handleExportButtonClick}
                      loading={isExportLoading}
                    >
                      Export to CSV
                    </ButtonWithSpinner>
                  </Box>

                  {isExportLoading && (
                    <Box flex={1} mx={1}>
                      <LinearProgressWithPercent value={exportProgress} />
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};
