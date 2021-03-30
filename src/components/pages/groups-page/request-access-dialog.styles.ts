import {
  createStyles,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  dialogContent: {
    lineHeight: theme.spacing(4),
  },
  formGroup: {
    marginBottom: theme.spacing(1),

    '& .MuiTextField-root': {
      margin: `${theme.spacing(2)}px 0`,
    },
  },
}));
