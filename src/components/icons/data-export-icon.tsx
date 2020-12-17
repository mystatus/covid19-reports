import React from 'react';
import ReplyAllIcon from '@material-ui/icons/ReplyAll';
import useStyles from './icons.styles';

export const DataExportIcon = () => {
  const classes = useStyles();
  return (
    <ReplyAllIcon className={classes.dataExportIcon} />
  );
};
