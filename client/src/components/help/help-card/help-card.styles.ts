import { Theme } from '@material-ui/core/styles';
import {
  makeStyles,
  createStyles,
} from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  card: {
    marginBottom: theme.spacing(3),
  },
  cardInfo: {
    backgroundColor: '#ECF4FC',
  },
  cardContent: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  cardActions: {
    paddingTop: 0,
  },
}));
