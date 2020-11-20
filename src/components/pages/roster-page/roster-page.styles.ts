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
  secondaryButtons: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  secondaryButton: {
    borderWidth: 2,
    marginRight: theme.spacing(2),

    '&:hover': {
      borderWidth: 2,
    },
  },
  secondaryButtonCount: {
    backgroundColor: '#005ea2',
    borderRadius: '50%',
    color: '#fff',
    fontSize: '12px !important',
    height: '18px',
    minWidth: '18px',
  },
  tableWrapper: {
    overflowY: 'auto',

    '& tr > *': {
      maxWidth: '220px',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  columnItem: {
    paddingBottom: 0,
    paddingTop: 0,
  },
}));
