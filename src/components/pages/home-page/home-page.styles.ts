import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  card: {
    height: '100%',

    '& .MuiCardContent-root': {
      padding: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
  },
  metricLabel: {
    ...theme.typography.body1,
    fontWeight: 600,
    flex: '1 1 100%',
    marginTop: '-6px',
    position: 'relative',
    '& .MuiSvgIcon-root': {
      color: theme.palette.grey[500],
      marginLeft: '6px',
      position: 'absolute',
    },
  },
  metricTrending: {
    alignItems: 'center',
    display: 'flex',
    marginTop: '-2px',
    marginBottom: '-8px',
  },
  metricTrendingIcon: {
    display: 'flex',
    borderRadius: '50%',
    backgroundColor: '#d8d8d8',
    transform: 'scale(0.8) rotate(90deg)',
    height: '32px',
    width: '32px',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 500ms',
    marginRight: '5px',
  },
  metricUp: {
    color: 'green',
    '& $metricTrendingIcon': {
      backgroundColor: '#cfc',
      display: 'flex',
      transform: 'scale(0.8) rotate(0deg)',
      '& .MuiSvgIcon-root': {
        color: 'green',
      },
    },
  },
  metricDown: {
    color: 'red',
    '& $metricTrendingIcon': {
      backgroundColor: '#fcc',
      display: 'flex',
      transform: 'scale(0.8) rotate(180deg)',
      '& .MuiSvgIcon-root': {
        color: 'red',
      },
    },
  },
  metricValue: {
    ...theme.typography.h1,
    marginTop: '12px',
    marginBottom: '6px',
  },
  hint: {
    color: theme.palette.grey[500],
  },
}));
