import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  dialogTitle: {
    paddingTop: 0,
  },
  roleSelect: {
    minWidth: '150px',
    marginBottom: '15px',
    marginTop: '15px',
    width: '100%',
  },
  rolePermissionHeader: {
    padding: '3px 16px',
    backgroundColor: '#DEDEDE',
  },
  rolePermissionCell: {
    padding: '0px 16px',
    height: '32px',
    backgroundColor: '#F0F1F1',
  },
  rolePermissionIconCell: {
    padding: '0px 16px',
    height: '32px',
    textAlign: 'center',
    backgroundColor: '#EAEAEA',
    '& svg': {
      position: 'relative',
      top: '3px',
      color: theme.palette.primary.light,
    },
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
