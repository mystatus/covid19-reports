import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  fillWidth: {
    width: '100%',
  },
  tableOptions: {
    borderBottom: `solid 1px ${theme.palette.divider}`,

    '& > *:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
  trendCountSelect: {
    '&.MuiInputBase-root': {
      border: 'none',
      borderBottom: '1px solid',
      borderColor: 'rgba(0, 0, 0, 0.54) !important',
      borderRadius: 0,
    },
  },
  tableHeaderControls: {
    padding: theme.spacing(3),

    '& .MuiTextField-root': {
      margin: 0,
    },

    '& .MuiButton-root': {
      whiteSpace: 'nowrap',
    },
  },
  timeRangeSelect: {
    fontSize: '14px',
    color: theme.palette.primary.main,
    border: 'none',
    marginLeft: theme.spacing(2),

    '& .MuiSelect-select': {
      paddingTop: '0',
      paddingBottom: '0',
    },
  },
}));
