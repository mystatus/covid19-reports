import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  menuItem: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  itemName: {
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
}));
