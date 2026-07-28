// frontend1/src/components/pins/PinForm.jsx
import { useState, useMemo } from 'react';
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
import { PIN_STATUS_OPTIONS, PIN_STATUS_UPDATE_OPTIONS, NF_STATUS_OPTIONS, YES_NO_OPTIONS } from '../../constants/status';
import { useCustomers } from '../../hooks/useCustomers';
import { useDevices } from '../../hooks/useDevices';
import DeviceFormDialog from '../customers/DeviceFormDialog';

const EMPTY_VALUES = {
  equipament: '',
  serie: '',
  cliente: '',
  customerId: '',
  deviceId: '',
  ctf1: '',
  ctf2: '',
  status: 'Recebido',
  nf: '',
  statusNf: '',
  PDC: '',
  OBS: '',
  itsNew: 'Sim',
  entryDate: new Date().toISOString().slice(0, 10),
  OS: '',
  finishDate: '',
};

export default function PinForm({ initialValues, onSubmit, submitLabel = 'Salvar', mode = 'create', equipOptions = [] }) {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues });
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);

  const { customers } = useCustomers();
  const { devices, createDevice } = useDevices(values.customerId || null);

  const statusOptions = mode === 'update' ? PIN_STATUS_UPDATE_OPTIONS : PIN_STATUS_OPTIONS;

  const selectedCustomer = useMemo(
    () => customers.find((c) => c._id === values.customerId) || null,
    [customers, values.customerId]
  );

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCustomerChange = (_event, customer) => {
    setValues((prev) => ({
      ...prev,
      customerId: customer?._id || '',
      cliente: customer?.empresa || '',
      deviceId: '',
      equipament: '',
      serie: '',
    }));
  };

  const handleDeviceChange = (event) => {
    const deviceId = event.target.value;
    const device = devices.find((d) => d._id === deviceId);
    setValues((prev) => ({
      ...prev,
      deviceId,
      equipament: device?.nome || prev.equipament,
      serie: device?.serie || prev.serie,
    }));
  };

  const handleCreateDevice = async (deviceValues) => {
    try {
      const created = await createDevice(deviceValues);
      setValues((prev) => ({
        ...prev,
        deviceId: created._id,
        equipament: created.nome,
        serie: created.serie,
      }));
      setDeviceDialogOpen(false);
    } catch (err) {
      console.error('Erro ao criar device:', err);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            CLIENTE
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Autocomplete
            options={customers}
            getOptionLabel={(customer) => customer.empresa || ''}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={selectedCustomer}
            onChange={handleCustomerChange}
            renderInput={(params) => <TextField {...params} label="Cliente" required fullWidth />}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            EQUIPAMENTO
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <FormControl fullWidth required disabled={!values.customerId}>
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
                disabled={!values.customerId}
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
                onInputChange={(_e, newValue) => setValues((prev) => ({ ...prev, equipament: newValue }))}
                renderInput={(params) => <TextField {...params} label="Equipamento" required fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Série" fullWidth required value={values.serie} onChange={handleChange('serie')} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Ordem de Serviço" fullWidth value={values.OS} onChange={handleChange('OS')} />
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            STATUS E NOTA FISCAL
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select value={values.status} label="Status" onChange={handleChange('status')}>
                  {statusOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Novo?</InputLabel>
                <Select value={values.itsNew} label="Novo?" onChange={handleChange('itsNew')}>
                  {YES_NO_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status NF</InputLabel>
                <Select value={values.statusNf} label="Status NF" onChange={handleChange('statusNf')}>
                  {NF_STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Nota Fiscal" fullWidth value={values.nf} onChange={handleChange('nf')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="CTF 1" fullWidth value={values.ctf1} onChange={handleChange('ctf1')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="CTF 2" fullWidth value={values.ctf2} onChange={handleChange('ctf2')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Data de Entrada"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={values.entryDate?.slice ? values.entryDate.slice(0, 10) : values.entryDate}
                onChange={handleChange('entryDate')}
              />
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
          </Grid>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            OBSERVAÇÕES
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField
            label="Observações"
            fullWidth
            multiline
            minRows={3}
            value={values.OBS}
            onChange={handleChange('OBS')}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" size="large">
            {submitLabel}
          </Button>
        </Box>
      </Stack>

      <DeviceFormDialog
        open={deviceDialogOpen}
        initialValues={null}
        onClose={() => setDeviceDialogOpen(false)}
        onSubmit={handleCreateDevice}
      />
    </Box>
  );
}
