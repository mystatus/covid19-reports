import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  card: {
    height: '100%',
  },
  li: {
    paddingBottom: theme.spacing(3),
  },
  colorPrimary: {
    color: theme.palette.primary.main,
  },
}));
