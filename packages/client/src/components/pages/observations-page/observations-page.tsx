import React from 'react';
import { Container } from '@material-ui/core';
import useStyles from '../roster-page/roster-page.styles';
import { ObservationsPageHelp } from './observations-page-help';
import ViewLayout from '../../view/view-layout';

export const ObservationsPage = () => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Container maxWidth={false}>
        <ViewLayout
          entityType="observation"
          header={{
            title: 'Observations',
            help: {
              contentComponent: ObservationsPageHelp,
              cardId: 'observationsPage',
            },
          }}
          idColumn={(row: any) => row.edipi + row.timestamp}
        />
      </Container>
    </main>
  );
};
