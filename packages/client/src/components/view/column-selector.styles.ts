import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  tableHeaderButton: {
    borderWidth: 2,
    marginRight: theme.spacing(2),

    '&:hover': {
      borderWidth: 2,
    },
  },
  dragHint: {
    opacity: 0.7,
    padding: '2px 8px 8px',
    textAlign: 'center',
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
  columnSelectSection: {
    backgroundColor: '#f8f8f8',
    color: '#555',
    fontSize: '0.9rem',
    fontWeight: 500,
    padding: '8px 12px 4px',
    margin: '0 0 -2px',
    userSelect: 'none',
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
}));
