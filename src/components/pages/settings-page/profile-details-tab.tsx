import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import useStyles from './profile-details-tab.styles';
import { TabPanelProps } from './settings-page';

export const ProfileDetailsTab = (props: TabPanelProps) => {
  const classes = useStyles();
  const {
    value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
      className={classes.root}
    >
      {value === index && (
        <Paper elevation={3}>
          <h2>Profile Details</h2>
          <Typography>Coming soon...</Typography>
        </Paper>
      )}
    </div>
  );
};
