import Dialog from '@mui/material/Dialog';
import { useIsPhone } from '../../hooks/useBreakpoints';

// Form dialogs take the whole screen on phones.
export default function ResponsiveDialog({ children, ...dialogProps }) {
  const isPhone = useIsPhone();
  return (
    <Dialog fullScreen={isPhone} fullWidth maxWidth="sm" {...dialogProps}>
      {children}
    </Dialog>
  );
}
