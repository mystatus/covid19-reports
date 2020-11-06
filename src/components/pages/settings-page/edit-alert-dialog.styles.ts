import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles(() => createStyles({
  root: {
    '& .MuiGrid-spacing-xs-3': {
      margin: '0px -12px',
    },
  },
  textField: {
    width: '100%',
    margin: 0,
    '& .MuiInputBase-multiline': {
      padding: 0,
      '& textarea': {
        padding: '8px 12px',
      },
    },
  },
  gridLabel: {
    margin: 'auto',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: '24px',
    color: '#3D4551',
  },
  dialogActions: {
    justifyContent: 'center',
    backgroundColor: '#F0F1F1',
    padding: '15px 35px',
  },
  settingBlock: {
    padding: '10px',
    backgroundColor: '#E0F7F6',
    width: '100%',
  },
  invalidSettingBlock: {
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#f7e0e0',
    width: '100%',
  },
}));
