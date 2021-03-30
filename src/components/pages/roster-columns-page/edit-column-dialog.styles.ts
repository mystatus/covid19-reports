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
  optionsHeaderLabel: {
    marginTop: theme.spacing(3),
  },
  flagTableBorder: {
    border: `1px solid ${theme.palette.text.hint}`,
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
  addEnumButton: {
    borderColor: 'transparent',
    marginTop: theme.spacing(2),
  },
  removeEnumButton: {
    color: '#E41D3D',
    fontWeight: 'bold',
    padding: 7,
  },
}));
