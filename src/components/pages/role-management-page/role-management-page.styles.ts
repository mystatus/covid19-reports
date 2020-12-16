import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  accordionHeader: {
    display: 'flex',
    margin: '0px 48px 0px 16px',
    '& p': {
      textTransform: 'uppercase',
      flexBasis: '33.33%',
      flexShrink: 0,
      fontWeight: 'bold',
      fontSize: '13px',
      color: theme.palette.text.hint,
    },
  },
  roleAccordion: {
    margin: '16px 0px',
    transition: 'box-shadow 150ms',
    borderRadius: '4px',
    '&.MuiAccordion-root.Mui-expanded': {
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
    },
    '& .MuiAccordionSummary-root.Mui-expanded': {
      borderBottom: '1px solid #DCDEE0',
    },
    '&:before': {
      backgroundColor: 'initial',
    },
  },
  nameColumn: {
    flexBasis: '33.33%',
    flexShrink: 0,
    fontWeight: 600,
  },
  indexPrefixColumn: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  roleButtons: {
    borderTop: '1px solid #DCDEE0',
    '& .MuiButton-root': {
      margin: '0px 5px',
    },
  },
  deleteRoleButton: {
    color: '#E41D3D',
    border: '2px solid #E41D3D',
    '&:hover': {
      border: '2px solid #B6001D',
      color: '#B6001D',
      backgroundColor: 'white',
    },
  },
}));
