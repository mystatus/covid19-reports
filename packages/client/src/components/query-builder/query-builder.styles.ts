import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  rowsContainer: {
    flexGrow: 1,
    '& > .MuiGrid-container': {
      flexWrap: 'nowrap',
    },
    marginBottom: theme.spacing(2),
  },
  button: {
    borderColor: 'transparent',
    marginRight: theme.spacing(2),
  },
  deleteButton: {
    borderColor: 'transparent',
    color: '#E41D3D',
    marginRight: theme.spacing(2),
    '&:hover': {
      borderColor: '#E41D3D',
    },
  },
  textField: {
    margin: 0,
  },
  pickListSelect: {
    minWidth: '193px',
  },
  tooltipMultiline: {
    whiteSpace: 'pre-line',
  },
}));
