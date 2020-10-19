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
  typeText: {
    textTransform: 'capitalize',
  },
  headerLabel: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: '24px',
    color: '#A9AEB1',
  },
  flagTableBorder: {
    border: '1px solid #71767a',
    borderRadius: '4px',
  },
  typeSelect: {
    width: '100%',
    '&:before': {
      border: 'none',
    },
    '& option, & select': {
      textTransform: 'capitalize',
    },
  },
  dialogActions: {
    justifyContent: 'center',
    backgroundColor: '#F0F1F1',
    padding: '15px 35px',
  },
}));
