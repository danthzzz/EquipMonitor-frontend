import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

// Blocking progress while photos go to SharePoint (closing the tab would leave them pending).
export default function UploadProgressDialog({ open, title = 'Enviando fotos', message, value }) {
  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" mb={2}>{message}</Typography>
        <LinearProgress variant={value === undefined ? 'indeterminate' : 'determinate'} value={value} />
      </DialogContent>
    </Dialog>
  );
}
