import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  dateRange: {
    display: 'flex',
    alignItems: 'center',
  },
  startDate: {
    margin: `0 ${theme.spacing(2)}px 0 0`,
  },
  endDate: {
    margin: `0 0 0 ${theme.spacing(2)}px`,
  },
  to: {
    transform: 'translateY(7px)',
  },
}));
