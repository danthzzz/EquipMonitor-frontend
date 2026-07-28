import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import StatusChip from '../common/StatusChip';
import { formatDate } from '../../utils/dateUtils';

export default function CalibrationHistoryItem({ pin }) {
  const navigate = useNavigate();
  const referenceDate = pin.finishDate || pin.entryDate;
  const certificado = [pin.ctf1, pin.ctf2].filter(Boolean).join(', ') || '—';

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, cursor: 'pointer' }}
      onClick={() => navigate(`/pin/${pin._id}`)}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhe da calibração de ${pin.equipament}`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') navigate(`/pin/${pin._id}`);
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Stack spacing={0.25}>
          <Typography variant="subtitle2" fontWeight={600}>
            {pin.equipament} {pin.serie ? `— ${pin.serie}` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {referenceDate ? formatDate(referenceDate) : 'Sem data'} · Certificado: {certificado}
          </Typography>
        </Stack>
        <StatusChip status={pin.status} />
      </Stack>
    </Paper>
  );
}
