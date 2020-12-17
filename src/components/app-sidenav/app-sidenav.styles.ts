import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export const sidenavWidthExpanded = 240;
export const sidenavWidthCollapsed = 70;

const expanderRadius = 13;

export default makeStyles((theme: Theme) => createStyles({
  root: {
    '& a': {
      textDecoration: 'none',
      color: 'inherit',
    },
  },
  expander: {
    position: 'fixed',
    top: '79px',
    zIndex: 10000,
    left: sidenavWidthExpanded - expanderRadius - 5,
    backgroundColor: theme.palette.background.default,
    width: expanderRadius + 5,
    height: (expanderRadius + 5) * 2,
    borderTopLeftRadius: expanderRadius + 5,
    borderBottomLeftRadius: expanderRadius + 5,
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    '& button': {
      fontSize: expanderRadius * 1.5,
      width: expanderRadius * 2,
      height: expanderRadius * 2,
      borderRadius: expanderRadius,
      color: theme.palette.text.hint,
      border: '1px solid rgba(0, 0, 0, 0.12)',
      backgroundColor: 'white',
      position: 'relative',
      top: '4px',
      left: '4px',
    },
  },
  expanderExpanded: {
    left: sidenavWidthExpanded - expanderRadius - 5,
    transition: theme.transitions.create('left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '& button': {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  expanderCollapsed: {
    left: sidenavWidthCollapsed - expanderRadius - 5,
    transition: theme.transitions.create('left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    '& button': {
      transform: 'rotate(180deg)',
      transition: theme.transitions.create('transform', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  sidenav: {
    width: sidenavWidthExpanded,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },

  sidenavExpanded: {
    width: sidenavWidthExpanded,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  sidenavCollapsed: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: sidenavWidthCollapsed,
  },
  header: {
    textTransform: 'uppercase',
    fontWeight: 500,
    opacity: 1,
    fontSize: '.75rem',
    letterSpacing: '2px',
    margin: '5px 16px',
    borderTop: '1px solid rgba(117, 128, 142, 0)',
    color: 'rgba(117, 128, 142, 0.75)',
  },
  headerExpanded: {
    margin: '5px 12px',
    borderTop: '1px solid #DCDEE000',
    color: 'rgba(117, 128, 142, 0.75)',
    transition: theme.transitions.create(['color', 'border', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  headerCollapsed: {
    margin: '0px 0px -15px 0px',
    borderTop: '1px solid #DCDEE0',
    color: 'rgba(117, 128, 142, 0)',
    transition: theme.transitions.create(['color', 'border', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  inactiveLink: {
    '& .MuiListItem-root': {
      color: theme.palette.text.hint,
      paddingLeft: '23px',
      '&.MuiTypography-root': {
        fontWeight: 500,
      },
      '& svg': {
        color: '#A9AEB1',
      },
    },
  },
  activeLink: {
    '& .MuiListItem-root': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      color: theme.palette.primary.main,
      paddingLeft: '19px',
      '&.MuiTypography-root': {
        fontWeight: 500,
      },
      '& svg': {
        color: theme.palette.primary.main,
      },
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));
