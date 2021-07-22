import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles(() => createStyles({
  root: {
    textDecoration: 'underline',
    textDecorationStyle: 'dotted',
    cursor: 'help',
  },
}));
