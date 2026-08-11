import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#1565c0' : '#64b5f6',
    },
    success: {
      main: mode === 'light' ? '#2e7d32' : '#66bb6a',
    },
    warning: {
      main: mode === 'light' ? '#ed6c02' : '#ffb74d',
    },
    error: {
      main: mode === 'light' ? '#c62828' : '#ef5350',
    },
    background: {
      default: mode === 'light' ? '#f4f6f8' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontSize: 13,
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor:
            mode === 'light' ? 'rgba(0,0,0,0.25) transparent' : 'rgba(255,255,255,0.25) transparent',
        },
        '*::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: mode === 'light' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)',
          borderRadius: 8,
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: mode === 'light' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { padding: '8px 12px' },
        head: { fontWeight: 700 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

export default function getAppTheme(mode) {
  return createTheme(getDesignTokens(mode));
}
