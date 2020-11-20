import React from 'react';
import { Typography } from '@material-ui/core';
import useStyles from './page-header.styles';

export interface PageHeaderProps {
  title: string
  info?: string
}

const PageHeader = ({ title, info }: PageHeaderProps) => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <Typography className={classes.title}>{title}</Typography>
      {info && (
        <Typography className={classes.info}>{info}</Typography>
      )}
    </header>
  );
};

export default PageHeader;
