import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  fillWidth: {
    width: '100%',
  },
  secondaryButtons: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  secondaryButton: {
    borderWidth: 2,
    marginRight: theme.spacing(2),

    '&:hover': {
      borderWidth: 2,
    },
  },
  secondaryButtonCount: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    color: '#fff',
    fontSize: '12px !important',
    height: '18px',
    minWidth: '18px',
  },
  tableWrapper: {
    overflowY: 'auto',
    width: '100%',

    '& tr > *': {
      whiteSpace: 'nowrap',
    },
  },
  pagination: {
    float: 'right',
  },
  columnItem: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  deleteDialogActions: {
    justifyContent: 'center',
    backgroundColor: '#F0F1F1',
    padding: '15px 35px',
    marginTop: '20px',
  },
  table: {
    marginBottom: '39px',
  },
  claimedOrphanRow: {
    '& td': {
      fontWeight: 'bold',
    },
  },
  deleteOrphanedMenuItem: {
    color: theme.palette.error.main,
    '&:hover': {
      backgroundColor: '#B6001D20',
    },
  },
  deleteOrphanedRecordConfirmButton: {
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: '#B6001D',
    },
  },
}));
