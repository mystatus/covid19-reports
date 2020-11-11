import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles(() => createStyles({
  root: {
    flexGrow: 1,
  },
  infoIcon: {
    color: '#71767A',
    fontSize: '20px',
    marginLeft: '5px',
  },
  alertsTable: {
    '& .MuiTableCell-root': {
      padding: '25px 16px 25px 0px',
      borderTop: '0.75px solid #DCDEE0',
      borderBottom: 0,
      verticalAlign: 'top',
    },
  },
  alertName: {
    fontWeight: 'bold',
  },
  alertSwitchCell: {
    paddingLeft: '0px !important',
    paddingRight: '0px !important',
    width: '58px',
  },
  alertSwitchDeactivated: {
    left: '-12px',
    top: '-8px',
    '& .MuiIconButton-label': {
      color: '#A9AEB1',
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#DCDEE0',
      opacity: 1,
    },
  },
  alertSwitchActivated: {
    left: '-12px',
    top: '-8px',
    '& .MuiIconButton-label': {
      color: '#005EA2',
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#D9E8F6',
      opacity: 1,
    },
  },
  alertSettingCell: {
    width: '50%',
    '& .MuiPaper-root': {
      padding: '10px',
      backgroundColor: '#E0F7F6',
      width: '100%',
      '& > div': {
        display: 'inline',
      },
    },
  },
  changeAlertButton: {
    textTransform: 'none',
    fontWeight: 'bold',
    color: '#005EA2',
    padding: '0px',
  },
}));
