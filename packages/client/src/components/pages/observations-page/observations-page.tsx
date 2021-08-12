import React from 'react';
import { Container } from '@material-ui/core';
import { FilterEntityType } from '@covid19-reports/shared';
import useStyles from '../roster-page/roster-page.styles';
import PageHeader from '../../page-header/page-header';
import { ObservationsPageHelp } from './observations-page-help';
import View from '../../view/view';
import { ApiObservation } from '../../../models/api-response';
import { ObservationClient } from '../../../client/observation.client';

export const ObservationsPage = () => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Container maxWidth={false}>
        <PageHeader
          title="Observations"
          help={{
            contentComponent: ObservationsPageHelp,
            cardId: 'observationsPage',
          }}
        />

        <View<ApiObservation>
          allowedColumns={ObservationClient.getAllowedColumnsInfo}
          entityType={FilterEntityType.Observation}
          query={ObservationClient.getObservations}
        />
      </Container>
    </main>
  );
};
