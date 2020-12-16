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
        color: theme.palette.primary.main,
      },
    },
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  },
}));
