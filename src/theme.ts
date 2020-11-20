// HACK: Using the unstable version of createMuiTheme fixes the findDOMNode warnings. It should be switched back to
//       the regular function on the next material-ui version (5.x).
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
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
  MuiButtonBase: {
    root: {
      '&.MuiToggleButton-root': {
        paddingTop: '4px',
        paddingBottom: '4px',
        borderColor: '#71767A',
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
    },
  },
  MuiCardContent: {
    root: {
      padding: theme.spacing(4),

      '& header > *:nth-child(1)': theme.typography.h2,
      '& header p': theme.typography.subtitle1,
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
        backgroundColor: 'rgb(240, 240, 240)',
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
      border: '1px solid #71767A',
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
        color: '#3D4551',
      },

      '& label + .MuiInput-formControl': {
        marginTop: '18px',
      },
    },
  },
};

theme.props = {
  MuiButton: {
    color: 'primary',
    variant: 'contained',
  },
  MuiIconButton: {
    color: 'primary',
  },
  MuiInput: {
    disableUnderline: true,
  },
  MuiTextField: {
    InputLabelProps: {
      shrink: true,
    },
  },
};

export default theme;
