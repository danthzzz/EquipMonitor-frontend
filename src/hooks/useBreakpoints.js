import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Below `md`: lists render as cards and the add action becomes a floating button.
export function useIsCompact() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
}

// Below `sm`: single-column forms, full-screen form dialogs, sticky form actions.
export function useIsPhone() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
}
