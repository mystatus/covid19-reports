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
  },
  addRowButton: {
    borderColor: 'transparent',
    marginTop: theme.spacing(2),
  },
  removeRowButton: {
    color: '#E41D3D',
  },
  textField: {
    margin: 0,
  },
  pickListSelect: {
    minWidth: '193px',
  },
}));
