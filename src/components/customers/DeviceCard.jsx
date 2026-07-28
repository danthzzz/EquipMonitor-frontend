import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from '../../utils/dateUtils';

function getLastCalibration(device, allPins) {
  const devicePins = allPins.filter((pin) => pin.deviceId === device._id);
  if (devicePins.length === 0) return null;
  return devicePins.reduce((latest, pin) => {
    const candidate = pin.finishDate || pin.entryDate || '';
    return candidate > (latest || '') ? candidate : latest;
  }, null);
}

export default function DeviceCard({ device, allPins, pinsLoading, onClick, onEdit, onDelete }) {
  const lastCalibration = getLastCalibration(device, allPins);
  const isOverdue = device.proximaCalibracaoPrevista && new Date(device.proximaCalibracaoPrevista) < new Date();

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, cursor: 'pointer' }}
      onClick={() => onClick(device._id)}
      role="button"
      tabIndex={0}
      aria-label={`Ver histórico de calibração de ${device.nome}`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onClick(device._id);
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={0.25}>
          <Typography variant="subtitle2" fontWeight={600}>{device.nome}</Typography>
          <Typography variant="body2" color="text.secondary">Série: {device.serie}</Typography>
          <Typography variant="body2" color="text.secondary">
            Última calibração: {pinsLoading ? '...' : lastCalibration ? formatDate(lastCalibration) : '—'}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Próxima calibração: {device.proximaCalibracaoPrevista ? formatDate(device.proximaCalibracaoPrevista) : '—'}
            </Typography>
            {isOverdue && <Chip label="Vencida" color="error" size="small" />}
          </Stack>
        </Stack>
        <Stack direction="row">
          <Tooltip title="Editar">
            <IconButton size="small" onClick={(event) => { event.stopPropagation(); onEdit(device); }} aria-label={`Editar device ${device.nome}`}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton size="small" color="error" onClick={(event) => { event.stopPropagation(); onDelete(device); }} aria-label={`Excluir device ${device.nome}`}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
