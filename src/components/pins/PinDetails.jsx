import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import StatusChip from '../common/StatusChip';
import { getPinDeviceCode } from '../../utils/pinUtils';
import { NF_STATUS_SEMANTIC } from '../../constants/colors';

function Field({ label, value }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body1">{value || '—'}</Typography>
    </Grid>
  );
}

export default function PinDetails({ pin }) {
  const codigo = getPinDeviceCode(pin.equipament);

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} spacing={1} flexWrap="wrap" useFlexGap sx={{ overflowWrap: 'anywhere' }}>
        <Typography variant="h6">{pin.equipament}</Typography>
        <StatusChip status={pin.status} />
      </Stack>
      <Grid container spacing={2}>
        <Field label="Série" value={pin.serie} />
        <Field label="Código" value={codigo} />
        <Field label="Cliente" value={pin.cliente} />
        <Field label="Ordem de Serviço" value={pin.OS} />
        <Field label="CTF 1" value={pin.ctf1} />
        <Field label="CTF 2" value={pin.ctf2} />
        <Field label="Novo?" value={pin.itsNew} />
        <Field label="Nota Fiscal" value={pin.nf} />
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="caption" color="text.secondary">Status NF</Typography>
          <div><StatusChip status={pin.statusNf} map={NF_STATUS_SEMANTIC} /></div>
        </Grid>
        <Field label="PDC" value={pin.PDC} />
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary">Observações</Typography>
          <Typography variant="body1">{pin.OBS || '—'}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
