import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  tableButtons: {
    '& .MuiButtonBase-root': {
      padding: '6px 6px',
      minWidth: '0px',
    },
    '& MuiTableCell-root': {
      padding: '0px',
    },
  },
  editButton: {
    marginRight: '16px',
    border: '2px solid',
    '&:hover': {
      border: '2px solid',
    },
  },
  deleteButton: {
    color: '#E41D3D',
    border: '2px solid #E41D3D',
    '&:hover': {
      border: '2px solid #B6001D',
      color: '#B6001D',
      backgroundColor: 'white',
    },
  },
  noData: {
    textAlign: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));
