import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  table: {
    marginBottom: '39px',
    '& thead': {
      backgroundColor: theme.palette.background.default,
      '& th': {
        borderWidth: 0,
        padding: `10px ${theme.spacing(2)}px 8px`,
        '&:not(:last-child)': {
          borderLeft: `1px solid ${theme.palette.background.paper}`,
        },
      },
    },
    '& tr': {
      '& td': {
        borderColor: theme.palette.background.default,
        padding: `12px ${theme.spacing(2)}px`,

        '&:last-child': {
          padding: 0,
          width: 24,
        },
      },
    },
  },
  musterConfiguration: {
    width: '60%',
  },
  subtle: {
    color: '#A9AEB1',
  },
  iconCell: {
    width: '81px',
    '& > svg': {
      position: 'relative',
      top: '3px',
      color: theme.palette.primary.light,
    },
  },
  '@keyframes fadeOut': {
    '90%': {
      opacity: 1,
    },
    '100%': {
      opacity: 0,
    },
  },
}));
