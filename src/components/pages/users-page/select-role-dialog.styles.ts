import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles(() => createStyles({
  dialogTitle: {
    paddingTop: 0,
  },
  roleSelect: {
    minWidth: '150px',
    marginBottom: '15px',
    marginTop: '15px',
    width: '100%',
  },
  roleDialogActions: {
    justifyContent: 'center',
    backgroundColor: '#F0F1F1',
    marginTop: '10px',
    padding: '15px 35px',
  },
  roleHeader: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: '24px',
    color: '#A9AEB1',
  },
}));
