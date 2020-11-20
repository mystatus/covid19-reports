import { Theme, createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  header: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: '40px',
  },
  info: {
    color: theme.palette.text.hint,
    marginTop: theme.spacing(2),
  },
}));
