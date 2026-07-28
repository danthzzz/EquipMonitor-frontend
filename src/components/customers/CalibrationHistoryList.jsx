import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import HistoryIcon from '@mui/icons-material/History';
import CalibrationHistoryItem from './CalibrationHistoryItem';
import EmptyState from '../common/EmptyState';
import { useCalibrationHistory } from '../../hooks/useCalibrationHistory';
import { useDevices } from '../../hooks/useDevices';

export default function CalibrationHistoryList({ customerId, deviceFilter, onDeviceFilterChange }) {
  const { items, loading, error, filters, setFilters, hasMore, loadMore } = useCalibrationHistory(customerId);
  const { devices } = useDevices(customerId);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, deviceId: deviceFilter || '' }));
  }, [deviceFilter, setFilters]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>Histórico de Calibração</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField
          label="De"
          type="date"
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={filters.from}
          onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
        />
        <TextField
          label="Até"
          type="date"
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={filters.to}
          onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
        />
        <FormControl size="small" fullWidth>
          <InputLabel>Device</InputLabel>
          <Select
            label="Device"
            value={filters.deviceId}
            onChange={(event) => onDeviceFilterChange(event.target.value || null)}
          >
            <MenuItem value="">Todos</MenuItem>
            {devices.map((device) => (
              <MenuItem key={device._id} value={device._id}>{device.nome} ({device.serie})</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>Não foi possível carregar o histórico de calibração.</Alert>}

      {loading ? (
        <Stack spacing={1}>
          <Skeleton variant="rounded" height={72} />
          <Skeleton variant="rounded" height={72} />
          <Skeleton variant="rounded" height={72} />
        </Stack>
      ) : items.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="Nenhuma calibração encontrada"
          description="Nenhum registro de calibração corresponde aos filtros selecionados."
        />
      ) : (
        <Stack spacing={1}>
          {items.map((pin) => (
            <CalibrationHistoryItem key={pin._id} pin={pin} />
          ))}
          {hasMore && (
            <Button onClick={loadMore} sx={{ alignSelf: 'center', mt: 1 }}>
              Carregar mais
            </Button>
          )}
        </Stack>
      )}
    </Paper>
  );
}
