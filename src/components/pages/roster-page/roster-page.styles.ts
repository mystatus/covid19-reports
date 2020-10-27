import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  buttons: {
    display: 'flex',
    marginBottom: theme.spacing(3),

    '& .MuiButtonBase-root': {
      marginRight: theme.spacing(3),
    },
  },
  fillWidth: {
    width: '100%',
  },
}));
