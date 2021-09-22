import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  stickyDiv: {
    position: 'relative',
    marginLeft: theme.spacing(2),
  },
  revertButton: {
    borderColor: 'transparent',
    color: '#E41D3D',
    marginRight: theme.spacing(2),
    '&:hover': {
      borderColor: '#E41D3D',
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
  },
  button: {
    borderColor: 'transparent',
    marginRight: theme.spacing(2),
  },
}));
