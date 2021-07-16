import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  tableFooter: {
    flexShrink: 0,
    padding: '10px 20px',
    marginLeft: theme.spacing(3),
  },
}));
