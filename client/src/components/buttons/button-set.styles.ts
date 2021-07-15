import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  buttons: {
    display: 'flex',
    marginBottom: theme.spacing(3),

    '& .MuiButtonBase-root': {
      marginRight: theme.spacing(3),
    },
  },
}));
