import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    '& .MuiGrid-spacing-xs-3': {
      margin: '0px -12px',
    },
    '& .MuiPaper-root': {
      width: '100%',
    },
  },
  textField: {
    width: '100%',
    margin: 0,
  },
  headerLabel: {
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '18px',
    color: theme.palette.text.primary,
    marginBottom: '9px',
  },
  textCell: {
    width: '70%',
    backgroundColor: '#F0F1F1',
  },
  addMusterButton: {
    margin: '10px 0px 20px 10px',
    fontSize: '16px',
    textTransform: 'none',
    '& svg': {
      fontSize: '20px',
      position: 'relative',
      top: '-1px',
    },
  },
  musterTable: {
    marginTop: theme.spacing(3),
    '& .MuiTextField-root': {
      margin: 0,
    },
    '& th': {
      backgroundColor: '#F0F0F0',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      fontSize: '13px',
      lineHeight: '20px',
      padding: '10px 18px',
      borderLeft: '1px solid #e2e2e2',
      '&:first-child': {
        borderLeft: 'none',
      },
    },
    '& td': {
      padding: '8px 10px',
      borderLeft: '1px solid #f1f1f1',
      '&:first-child': {
        borderLeft: 'none',
      },
      '& > .MuiFormControl-root': {
        display: 'flex',
      },
    },
  },
  daysColumn: {
    width: '266px',
  },
  dayButtons: {
    display: 'flex',
    flexFlow: 'row',
    '& div': {
      width: '31px',
      height: '31px',
      margin: '2px',
      paddingTop: '1px',
      fontSize: '14px',
      cursor: 'pointer',
    },
  },
  dayButtonOn: {
    border: `1px solid ${theme.palette.primary.main}`,
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    '&$dayButtonDisabled': {
      backgroundColor: '#ddd',
      borderColor: '#ddd',
      color: theme.palette.text.primary,
    },
  },
  dayButtonOff: {
    border: '1px solid #DCDEE0',
    color: theme.palette.text.primary,
    backgroundColor: 'white',
  },
  dayButtonError: {
    border: '1px solid #E41D3D',
    color: theme.palette.text.primary,
    backgroundColor: 'white',
  },
  dayButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  reportCell: {
    width: '20%',
  },
  durationCell: {
    width: '12%',
  },
  timeZoneCell: {
    width: '20%',
    '& .MuiAutocomplete-inputRoot': {
      padding: '8px 12px',
      '& > input': {
        padding: '0 !important',
      },
    },
  },
  filterSelect: {

  },
  iconCell: {
    width: '24px',
    padding: '0px',
    height: '32px',
    textAlign: 'center',
    border: '0 !important',
    background: 'white !important',
    '& .MuiIconButton-root': {
      padding: 0,
    },
    '& svg': {
      color: '#E41D3D',
    },
  },
  errorMessage: {
    borderRadius: '4px',
    width: '100%',
    backgroundColor: '#F8DFE2',
    color: '#6F3331',
    fontWeight: 500,
    fontSize: '16px',
    margin: '20px 15px',
    textAlign: 'center',
    padding: '20px !important',
  },
  noDefaultConfig: {
    color: '#A9AEB1',
    marginLeft: '32px',
    marginTop: '-10px',
  },
}));
