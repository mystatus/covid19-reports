import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  table: {
    marginBottom: '39px',
  },
  tableHeader: {
    '& h2': {
      margin: 0,
      textTransform: 'none',
    },
  },
  confirmRemoveFromGroupContent: {
    svgIcon: {
      fontSize: '128px',
    },
  },
  confirmRemoveFromGroupIcon: {
    color: '#E41D3D',
    height: '76px',
    left: '50%',
    margin: '20px 0 10px -40px',
    position: 'relative',
    width: '88px',
  },
  confirmRemoveFromGroupActions: {
    backgroundColor: '#F0F1F1',
    justifyContent: 'center',
    margin: '45px -23px -8px',
    padding: '35px',
  },
  dangerButton: {
    backgroundColor: '#E41D3D',
  },
}));
