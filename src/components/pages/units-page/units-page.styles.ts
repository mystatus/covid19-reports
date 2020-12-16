import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  table: {
    marginBottom: '39px',
  },
  musterConfiguration: {
    width: '50%',
  },
  noMusterConfiguration: {
    width: '50%',
    color: '#A9AEB1',
  },
  iconCell: {
    width: '81px',
    '& > svg': {
      position: 'relative',
      top: '3px',
      color: theme.palette.primary.light,
    },
  },
}));
