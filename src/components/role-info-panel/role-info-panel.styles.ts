import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  roleHeader: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: '24px',
    color: '#A9AEB1',
  },
  tableScroll: {
    maxHeight: '225px',
    overflowY: 'auto',
  },
  roleTable: {
    '&  .MuiTableCell-root': {
      border: '1px solid #E0E0E0',
      padding: '0px 16px',
      height: '32px',
    },
  },
  textCell: {
    width: '70%',
    backgroundColor: '#F0F1F1',
  },
  iconCell: {
    textAlign: 'center',
    backgroundColor: '#EAEAEA',
    '& svg': {
      position: 'relative',
      top: '3px',
      color: theme.palette.primary.light,
    },
  },
}));
