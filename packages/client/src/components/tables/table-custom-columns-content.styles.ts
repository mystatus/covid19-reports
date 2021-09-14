import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  tableWrapper: {
    overflowY: 'auto',
    width: '100%',

    '& tr > *': {
      whiteSpace: 'nowrap',
    },
  },
  tableScroll: {
    width: '100%',
    overflowX: 'auto',
    '& tbody': {
      position: 'relative',
    },
  },
  tableTitle: {
    '& h2': {
      margin: 0,
      textTransform: 'none',
    },
  },
  tableName: {
    fontSize: '0.8rem',
    fontWeight: 300,
    marginLeft: 2,
    opacity: 0.9,
  },
  sortableHeader: {
    cursor: 'pointer',
    '& > div': {
      display: 'flex',
      flexFlow: 'row',
      '& > div:first-child': {
        userSelect: 'none',
        display: 'flex',
        flex: 1,
      },
      '& > div:last-child': {
        display: 'flex',
        flex: '0 0 24px',
        width: '24px',
      },
    },
  },
  leftShadowCell: {
    padding: '16px 0px',
    width: '1px',
    position: 'sticky',
    left: 0,
  },
  rightShadowCell: {
    padding: '16px 0px',
    width: '1px',
    position: 'sticky',
    right: 0,
  },
  leftShadow: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '15px',
    height: '100%',
    background: 'linear-gradient(to right, #dcdcdc73, #dcdcdc00)',
  },
  rightShadow: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    width: '15px',
    height: '100%',
    background: 'linear-gradient(to left, #dcdcdc73, #dcdcdc00)',
  },
  iconHeader: {
    width: '81px',
    position: 'sticky',
    background: 'linear-gradient(to left, white, transparent)',
    right: 0,
  },
  iconCell: {
    width: '81px',
    position: 'sticky',
    background: theme.palette.background.paper,
    right: 0,
    '& > svg': {
      position: 'relative',
      top: '3px',
      color: theme.palette.primary.light,
    },
  },
  iconShadow: {
    position: 'absolute',
    top: '0px',
    width: '15px',
    left: '-15px',
    height: '100%',
    background: 'linear-gradient(to left, #dcdcdc73, #dcdcdc00)',
  },
  noData: {
    margin: theme.spacing(1),
    fontStyle: 'italic',
  },
}));
