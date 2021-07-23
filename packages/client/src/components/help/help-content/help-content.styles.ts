import { Theme } from '@material-ui/core/styles';
import {
  makeStyles,
  createStyles,
} from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    fontSize: '16px',
    lineHeight: '28px',

    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },

    '& li:not(:last-child)': {
      paddingBottom: theme.spacing(1),
    },
  },
}));
