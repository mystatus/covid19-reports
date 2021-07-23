import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    '& .MuiGrid-spacing-xs-3': {
      margin: '0px -12px',
    },
  },
  textField: {
    width: '100%',
    margin: 0,
  },
  gridLabel: {
    margin: 'auto',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: '24px',
    color: theme.palette.text.primary,
  },
  settingBlock: {
    padding: '10px',
    backgroundColor: theme.palette.secondary.light,
    width: '100%',
  },
  invalidSettingBlock: {
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#f7e0e0',
    width: '100%',
  },
}));
