import {
  createStyles,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  listHeader: {
    display: 'flex',
    margin: '0px 48px 0px 16px',
    '& p': {
      textTransform: 'uppercase',
      flexBasis: '33.33%',
      flexShrink: 0,
      fontWeight: 'bold',
      fontSize: '13px',
      color: theme.palette.text.hint,
    },
  },
  card: {
    transitionProperty: 'box-shadow, transform',
    cursor: 'pointer',

    '& .MuiButtonBase-root': {
      transitionDuration: theme.transitions.duration.standard,
      pointerEvents: 'none',

      '& .MuiSvgIcon-root': {
        transitionProperty: 'color',
        transitionDuration: theme.transitions.duration.standard,
      },
    },

    '&:hover': {
      boxShadow: theme.shadows[6],
      transform: 'translateY(-4px)',

      '& .MuiButtonBase-root': {
        backgroundColor: theme.palette.primary.main,

        '& .MuiSvgIcon-root': {
          color: 'white',
        },
      },
    },
  },
  cardContent: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3),

    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
  },
  workspaceName: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: 'bold',
    marginBottom: '2px',
  },
  workspaceDescription: {
    height: '2rem',
  },
}));
