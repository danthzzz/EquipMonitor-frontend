import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { PIN_STATUS_OPTIONS, PIN_STATUS_UPDATE_OPTIONS, YES_NO_OPTIONS } from '../../constants/status';
import DeviceFormDialog from '../customers/DeviceFormDialog';

export default function PinEquipamentoFields({
  values,
  onValuesChange,
  devices,
  createDevice,
  customerId,
  equipOptions,
  mode = 'create',
  title = 'EQUIPAMENTO',
  onRemove,
}) {
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const statusOptions = mode === 'update' ? PIN_STATUS_UPDATE_OPTIONS : PIN_STATUS_OPTIONS;

  const handleChange = (field) => (event) => {
    onValuesChange({ [field]: event.target.value });
  };

  const handleDeviceChange = (event) => {
    const deviceId = event.target.value;
    const device = devices.find((d) => d._id === deviceId);
    onValuesChange({
      deviceId,
      equipament: device?.nome || values.equipament,
      serie: device?.serie || values.serie,
      codigo: device?.codigo || '',
    });
  };

  const handleCreateDevice = async (deviceValues) => {
    try {
      const created = await createDevice(deviceValues);
      onValuesChange({
        deviceId: created._id,
        equipament: created.nome,
        serie: created.serie,
        codigo: created.codigo || '',
      });
      setDeviceDialogOpen(false);
    } catch (err) {
      console.error('Erro ao criar device:', err);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        {onRemove && (
          <Button size="small" color="error" onClick={onRemove}>
            Remover Equipamento
          </Button>
        )}
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <FormControl fullWidth required disabled={!customerId}>
            <InputLabel>Device</InputLabel>
            <Select value={values.deviceId} label="Device" onChange={handleDeviceChange}>
              {devices.map((device) => (
                <MenuItem key={device._id} value={device._id}>{device.nome} ({device.serie})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="outlined"
            fullWidth
            disabled={!customerId}
            onClick={() => setDeviceDialogOpen(true)}
            sx={{ height: '100%' }}
          >
            Novo Device
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            freeSolo
            options={equipOptions.map((o) => o.label)}
            value={values.equipament}
            onInputChange={(_e, newValue) => onValuesChange({ equipament: newValue })}
            renderInput={(params) => <TextField {...params} label="Equipamento" required fullWidth />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField label="Série" fullWidth required value={values.serie} onChange={handleChange('serie')} />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select value={values.status} label="Status" onChange={handleChange('status')}>
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Novo?</InputLabel>
            <Select value={values.itsNew} label="Novo?" onChange={handleChange('itsNew')}>
              {YES_NO_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField label="CTF 1" fullWidth value={values.ctf1} onChange={handleChange('ctf1')} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField label="CTF 2" fullWidth value={values.ctf2} onChange={handleChange('ctf2')} />
        </Grid>
        {mode === 'update' && (
          <Grid item xs={12} md={4}>
            <TextField
              label="Data de Finalização"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={values.finishDate?.slice ? values.finishDate.slice(0, 10) : values.finishDate}
              onChange={handleChange('finishDate')}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            label="Observações"
            fullWidth
            multiline
            minRows={3}
            value={values.OBS}
            onChange={handleChange('OBS')}
          />
        </Grid>
      </Grid>

      <DeviceFormDialog
        open={deviceDialogOpen}
        initialValues={null}
        onClose={() => setDeviceDialogOpen(false)}
        onSubmit={handleCreateDevice}
      />
    </Box>
  );
}
