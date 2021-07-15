import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  infoIcon: {
    color: theme.palette.text.hint,
    fontSize: '20px',
    marginLeft: '5px',
  },
  alertsHeader: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'row',
  },
  alertsTable: {
    '& .MuiTableCell-root': {
      padding: '25px 16px 25px 0px',
      borderTop: '0.75px solid #DCDEE0',
      borderBottom: 0,
      verticalAlign: 'top',
    },
  },
  noAlerts: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
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
      color: theme.palette.primary.main,
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
      backgroundColor: theme.palette.secondary.light,
      width: '100%',
      '& > div': {
        display: 'inline',
      },
    },
  },
  changeAlertButton: {
    textTransform: 'none',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    padding: '0px',
  },
}));
