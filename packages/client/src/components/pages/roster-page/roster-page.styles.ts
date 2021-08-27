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
  tableHeader: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  tableHeaderButton: {
    borderWidth: 2,
    marginRight: theme.spacing(2),

    '&:hover': {
      borderWidth: 2,
    },
  },
  tableHeaderButtonCount: {
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
  orphanUnitFilterTextField: {
    margin: `0 ${theme.spacing(1)}px`,
  },
  claimedOrphanRow: {
    '& td': {
      fontWeight: 'bold',
    },
  },
  tableHeaderButtonSelect: {
    borderWidth: 2,
    marginRight: theme.spacing(2),
    '&:hover': {
      borderWidth: 2,
    },
  },
  filterButtonText: {
    maxWidth: '10rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  button: {
    borderColor: 'transparent',
    marginRight: theme.spacing(2),
  },
  deleteButton: {
    borderColor: 'transparent',
    color: '#E41D3D',
    marginRight: theme.spacing(2),
    '&:hover': {
      borderColor: '#E41D3D',
    },
  },
}));
