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
  favoriteCell: {
    padding: 0,
  },
  favoriteIconOn: {
    fill: '#F2938C',
  },
  favoriteIconOff: {
    fill: theme.palette.grey.A200,
  },
}));
