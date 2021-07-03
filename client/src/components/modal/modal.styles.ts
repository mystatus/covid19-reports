import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  destructiveButton: {
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: '#B6001D',
    },
  },
}));
