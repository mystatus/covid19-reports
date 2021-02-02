import { Theme } from '@material-ui/core/styles';
import {
  makeStyles,
  createStyles,
} from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  card: {
    backgroundColor: '#ECF4FC',
    marginBottom: theme.spacing(3),
  },
  cardContent: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  cardActions: {
    paddingTop: 0,
  },
}));
