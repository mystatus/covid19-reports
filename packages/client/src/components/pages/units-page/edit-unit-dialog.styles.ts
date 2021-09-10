import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    '& .MuiGrid-spacing-xs-3': {
      margin: '0px -12px',
    },
    '& .MuiPaper-root': {
      width: '100%',
    },
  },
  textField: {
    width: '100%',
    margin: 0,
  },
  headerLabel: {
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '18px',
    color: theme.palette.text.primary,
    marginBottom: '9px',
  },
}));
