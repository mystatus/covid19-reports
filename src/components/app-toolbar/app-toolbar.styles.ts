import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { sidenavWidthExpanded } from '../app-sidenav/app-sidenav.styles';

export default makeStyles((theme: Theme) => createStyles({
  appBar: {
    backgroundColor: '#3A4759',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: sidenavWidthExpanded,
    width: `calc(100% - ${sidenavWidthExpanded}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  logo: {
    transform: 'translateY(-2px)',
  },
  spacer: {
    flex: 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  toolbarDivider: {
    padding: '15px 0px',
    borderLeft: '1px solid #536173',
    margin: '10px',
    alignSelf: 'center',
  },
  activeGroup: {
    color: '#00A91C',
    width: '24px',
    position: 'relative',
    top: '3px',
    left: '-2px',
    '& > svg': {
      fontSize: '1.25rem',
    },
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  toolbarButton: {
    color: 'white',
    textTransform: 'none',
    '& .MuiAvatar-root': {
      width: '32px',
      height: '32px',
      marginRight: '10px',
      top: '-1px',
      backgroundColor: '#73B3E7',
      fontSize: '14px',
    },
  },
  userMenuIcon: {
    position: 'relative',
    left: '-5px',
    top: '-1px',
    marginRight: '5px',
    color: '#757575',
  },
}));
