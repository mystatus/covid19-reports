import React from 'react';
import { Container } from '@material-ui/core';
import { EntityType } from '@covid19-reports/shared';
import useStyles from '../roster-page/roster-page.styles';
import PageHeader from '../../page-header/page-header';
import { ObservationsPageHelp } from './observations-page-help';
import View from '../../view/view';
import ViewLayout from '../../view/view-layout';
import { ObservationClient } from '../../../client/observation.client';

export const ObservationsPage = () => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Container maxWidth={false}>
        <ViewLayout
          allowedColumns={ObservationClient.getAllowedColumnsInfo}
          entityType={EntityType.Observation}
        >
          {(layout, editor) => (
            <>
              <PageHeader
                title="Observations"
                help={{
                  contentComponent: ObservationsPageHelp,
                  cardId: 'observationsPage',
                }}
                adjacentComponent={editor}
              />

              <View
                query={ObservationClient.getObservations}
                layout={layout}
              />
            </>
          )}
        </ViewLayout>
      </Container>
    </main>
  );
};
