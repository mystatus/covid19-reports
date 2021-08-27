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
  saveButton: {
    borderColor: 'transparent',
    marginRight: theme.spacing(2),
  },
  undoButton: {
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    color: '#777',
    '&:hover': {
      backgroundColor: '#f8f8f8',
      borderColor: '#ddd',
      color: '#666',
  }
  },
  layoutName: {
    textOverflow: 'ellipsis',
    marginRight: theme.spacing(2),
    whiteSpace: 'nowrap',
    width: 200,
  },
  iconButton: {
    padding: theme.spacing(1),
  },
  deleteButton: {
    color: '#E41D3D',
    padding: theme.spacing(1),
    marginRight: -theme.spacing(1),
  },
  fullWidth: {
    width: '100%',
  },
  columnSelectSection: {
    backgroundColor: '#f8f8f8',
    color: '#555',
    fontSize: '0.9rem',
    fontWeight: 500,
    padding: '8px 12px 4px',
    margin: '0 0 -2px',
    userSelect: 'none',
  },
  droppableList: {
    position: 'relative',
    // transition: 'all ease 150ms',
  },
  availableList: {
    minHeight: 70,
    position: 'relative',
    // transition: 'all ease 150ms',
  },
  deleteTarget: {
    color: '#944',
    position: 'absolute',
    top: 32,
    left: 0,
    right: 0,
    bottom: 0,
    width: 250,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 2,
    opacity: 0.5,
    userSelect: 'none',
  },
  draggableItem: {
    userSelect: 'none',
    padding: '2px 8px',
    margin: 0,
    background: 'white',
    border: '1px solid white',

    '&:hover': {
      borderRadius: 6,
      color: '#000',
    },
  },
  phipii: {
    fontSize: '0.7rem',
    fontWeight: 300,
    opacity: 0.9,
  },
  dragHint: {
    opacity: 0.7,
    padding: '2px 8px 8px',
    textAlign: 'center',
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
