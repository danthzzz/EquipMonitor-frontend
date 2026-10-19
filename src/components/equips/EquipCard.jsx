import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

export default function EquipCard({ equip }) {
  return (
    <Card variant="outlined" sx={{ p: 1.5, minWidth: 0 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Stack sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
          <Typography variant="subtitle2" fontWeight={700}>{equip.modelo}</Typography>
          <Typography variant="body2" color="text.secondary">{`Código: ${equip.codigo}`}</Typography>
        </Stack>
        <Chip label={equip.tipo} size="small" />
      </Stack>
    </Card>
  );
}
