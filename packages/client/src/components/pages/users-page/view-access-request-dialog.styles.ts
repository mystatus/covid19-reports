import { createStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    '& ol': {
      paddingInlineStart: theme.spacing(4),

      '& li': {
        marginBottom: theme.spacing(2),

        '&:last-child': {
          marginBottom: 0,
        },
      },
    },
  },
  dialogTitle: {
    paddingBottom: 0,

    '& .MuiTypography-root': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  dialogTitleUserName: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  dialogContent: {
    width: '550px',
  },
  section: {
    marginBottom: theme.spacing(3),
    width: '100%',
  },
  whatYouDoItem: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '14px',
  },
  approveButton: {
    backgroundColor: theme.palette.success.main,

    '&:hover': {
      backgroundColor: '#008C17',
    },
  },
  denyButton: {
    backgroundColor: theme.palette.error.main,

    '&:hover': {
      backgroundColor: '#B6001D',
    },
  },
  header: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  rolePermissionsContainer: {
    textAlign: 'center',
  },
  rolePermissions: {
    marginTop: theme.spacing(3),
    cursor: 'help',

    '&:hover': {
      backgroundColor: 'white',
    },
  },
  rolePermissionsTooltip: {
    maxWidth: 'none',
    backgroundColor: 'white',
    boxShadow: theme.shadows[4],
  },
  additionalInfo: {
    '& .MuiTypography-root': {
      fontSize: '14px',
    },
  },
  additionalInfoLeft: {
    whiteSpace: 'nowrap',

    '& .MuiTypography-root': {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
}));
