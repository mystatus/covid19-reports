import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  tabsRoot: {
    flexGrow: 1,
    display: 'flex',
    '& .MuiTabs-root': {
      marginRight: '10px',
      flexShrink: 0,
    },
    '& > div > .MuiPaper-root': {
      width: '100%',
      padding: '20px 47px',
    },
  },
  tabs: {
    '& .MuiTab-root': {
      paddingLeft: 0,
      textTransform: 'none',
      minWidth: 'unset',

      '& .MuiTab-wrapper': {
        alignItems: 'start',
      },

      '&.Mui-selected': {
        fontWeight: 'bold',
        color: '#005EA2',
      },
    },
    '& .MuiTabs-indicator': {
      display: 'none',
    },
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
  alertDescriptionCell: {

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
