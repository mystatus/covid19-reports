// HACK: Using the unstable version of createMuiTheme fixes the findDOMNode warnings. It should be switched back to
//       the regular function on the next material-ui version (5.x).
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    background: {
      default: 'rgb(240, 240,240)',
    },
    text: {
      primary: '#3D4551',
      hint: '#71767A',
    },
    primary: {
      main: '#005ea2',
      light: '#73B3E7',
    },
    secondary: {
      dark: '#09AFAD',
      main: '#29E1CB',
      light: '#E0F7F6',
    },
    warning: {
      main: '#C25D00',
    },
    error: {
      main: '#E41D3D',
    },
    success: {
      main: '#00A91C',
    },
  },
  typography: {
    h1: {
      fontSize: '40px',
      fontWeight: 700,
      lineHeight: '48px',
    },
    h2: {
      fontSize: '33px',
      fontWeight: 700,
      lineHeight: '48px',
    },
    subtitle1: {
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: '29px',
    },
  },
});

// Let's keep these sorted by name so we can easily find overrides.
theme.overrides = {
  MuiAppBar: {
    root: {
      boxShadow: 'none',
    },
  },
  MuiButton: {
    root: {
      textTransform: 'none',
    },
  },
  MuiButtonBase: {
    root: {
      '&.MuiButton-text.MuiButton-textSizeLarge': {
        color: theme.palette.text.primary,
        textTransform: 'none',
        '& svg': {
          color: theme.palette.primary.main,
        },
      },
      '&.MuiToggleButton-root': {
        paddingTop: '4px',
        paddingBottom: '4px',
        borderColor: theme.palette.text.hint,
        color: theme.palette.text.primary,

        '&.Mui-selected': {
          backgroundColor: theme.palette.secondary.light,
          borderColor: theme.palette.secondary.dark,
          color: theme.palette.secondary.dark,

          '&:hover': {
            backgroundColor: theme.palette.secondary.light,
          },
        },
      },
    },
  },
  MuiCardActions: {
    root: {
      padding: theme.spacing(3),
      '& + .MuiCardContent-root': {
        paddingTop: theme.spacing(3),
      },
    },
  },
  MuiCardContent: {
    root: {
      padding: theme.spacing(4),

      '&:last-child': {
        paddingBottom: theme.spacing(4),
      },

      '& header > *:nth-child(1)': theme.typography.h2,
      '& header p': theme.typography.subtitle1,

      '& .MuiCardActions-root': {
        padding: `${theme.spacing(3)}px 0 0`,
      },
    },
  },
  MuiCardHeader: {
    root: {
      padding: theme.spacing(4),
      paddingBottom: theme.spacing(0),
      '& + .MuiCardActions-root': {
        padding: `${theme.spacing(1)}px ${theme.spacing(3)}px 0`,
      },
    },
  },
  MuiChip: {
    root: {
      borderRadius: '4px',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
  MuiCssBaseline: {
    '@global': {
      body: {
        backgroundColor: theme.palette.background.default,
      },
      a: {
        textDecoration: 'none',
      },
    },
  },
  MuiDrawer: {
    root: {
      '& .MuiDrawer-paper': {
        top: 'unset',
        bottom: 0,
        height: `calc(100% - ${64}px)`,
      },
    },
  },
  MuiInputBase: {
    root: {
      border: `1px solid ${theme.palette.text.hint}`,
      borderRadius: '4px',
    },
  },
  MuiMenuItem: {
    root: {
      '& a': {
        color: 'inherit',
      },
    },
  },
  MuiPaper: {
    root: {
      '& .MuiToolbar-root': {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      },
    },
  },
  MuiSelect: {
    root: {
      padding: '8px 12px',
    },
  },
  MuiTableRow: {
    root: {
      '&:last-child': {
        '& .MuiTableCell-body': {
          borderBottom: 'none',
        },
      },
    },
  },
  MuiTableContainer: {
    root: {
      overflowY: 'hidden',
    },
  },
  MuiTableCell: {
    head: {
      textTransform: 'uppercase',
    },
    footer: {
      borderTop: `solid 1px rgb(224, 224, 224)`,
      borderBottom: 'none',
    },
  },
  MuiTextField: {
    root: {
      margin: theme.spacing(3),

      '& input': {
        padding: '8px 12px',
      },

      '& label': {
        fontSize: '16px',
        fontWeight: 600,
        color: theme.palette.text.primary,
      },

      '& label + .MuiInput-formControl': {
        marginTop: '18px',
      },
    },
  },
  MuiTooltip: {
    tooltip: {
      fontSize: '12px',
    },
  },
};

theme.props = {
  MuiButton: {
    color: 'primary',
    variant: 'contained',
    disableElevation: true,
  },
  MuiDialog: {
    disableBackdropClick: true,
  },
  MuiIconButton: {
    color: 'primary',
  },
  MuiInput: {
    disableUnderline: true,
  },
  MuiLink: {
    underline: 'none',
  },
  MuiTextField: {
    InputLabelProps: {
      shrink: true,
    },
  },
  MuiTooltip: {
    arrow: true,
  },
};

export default theme;
