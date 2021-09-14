import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  filterButtonText: {
    marginRight: theme.spacing(2),
    maxWidth: '10rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  menuItem: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  layoutName: {
    textOverflow: 'ellipsis',
    marginRight: theme.spacing(2),
    whiteSpace: 'nowrap',
    width: 200,
  },
  button: {
    borderColor: 'transparent',
    marginRight: theme.spacing(2),
  },
  iconButton: {
    padding: theme.spacing(1),
  },
  revertButton: {
    borderColor: 'transparent',
    color: '#E41D3D',
    marginRight: theme.spacing(2),
    '&:hover': {
      borderColor: '#E41D3D',
    },
  },
  deleteButton: {
    color: '#E41D3D',
    padding: theme.spacing(1),
    marginRight: -theme.spacing(1),
  },
  saveNoticeStatic: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  saveNoticeSticky: {
    position: 'fixed',
    top: 48,
    zIndex: 1202,
    minWidth: 'min-content',
    backgroundColor: '#fff',
    padding: 2,
  },
  stickyDiv: {
    position: 'relative',
    marginLeft: theme.spacing(2),
  },
}));
