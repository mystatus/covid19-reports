import { Box } from '@material-ui/core';
import React, { ReactNode } from 'react';
import useStyles from './help-content.styles';

export interface HelpContentProps {
  children?: ReactNode;
}

export const HelpContent = (props: HelpContentProps) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {children}
    </Box>
  );
};
