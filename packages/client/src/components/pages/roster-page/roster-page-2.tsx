import React from 'react';
import { Container } from '@material-ui/core';
import useStyles from '../roster-page/roster-page.styles';
import { RosterPageHelp } from './roster-page-help';
import ViewLayout from '../../view/view-layout';

export const RosterPage = () => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Container maxWidth={false}>
        <ViewLayout
          entityType="roster"
          header={{
            title: 'Roster',
            help: {
              contentComponent: RosterPageHelp,
              cardId: 'RosterPage',
            },
          }}
          idColumn={(row: any) => row.edipi}
        />
      </Container>
    </main>
  );
};
