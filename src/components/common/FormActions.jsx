import Box from '@mui/material/Box';
import { useIsPhone } from '../../hooks/useBreakpoints';

// Form submit/cancel buttons: a sticky full-width bar on phones, a right-aligned row elsewhere.
export default function FormActions({ children }) {
  const isPhone = useIsPhone();

  const sx = isPhone
    ? {
        position: 'sticky',
        bottom: 0,
        zIndex: 2,
        display: 'flex',
        gap: 1,
        py: 1.5,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        '& > *': { flex: 1 },
      }
    : { display: 'flex', justifyContent: 'flex-end', gap: 1 };

  return (
    <Box data-testid="form-actions" sx={sx}>
      {children}
    </Box>
  );
}
