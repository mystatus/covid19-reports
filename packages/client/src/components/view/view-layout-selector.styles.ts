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
  deleteButton: {
    color: '#E41D3D',
    padding: theme.spacing(1),
    marginRight: -theme.spacing(1),
  },
  undoButton: {
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    color: '#777',
    '&:hover': {
      backgroundColor: '#f8f8f8',
      borderColor: '#ddd',
      color: '#666',
    },
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

    '& $undoButton': {
      marginLeft: theme.spacing(2),
    },
  },
}));
