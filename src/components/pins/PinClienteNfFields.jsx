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
import { NF_STATUS_OPTIONS } from '../../constants/status';

export default function PinClienteNfFields({ values, onValuesChange, customers, selectedCustomer, onCustomerChange }) {
  const handleChange = (field) => (event) => {
    onValuesChange({ [field]: event.target.value });
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        CLIENTE E NOTA FISCAL
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            options={customers}
            getOptionLabel={(customer) => customer.empresa || ''}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={selectedCustomer}
            onChange={onCustomerChange}
            renderInput={(params) => <TextField {...params} label="Cliente" required fullWidth />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Ordem de Serviço" fullWidth value={values.OS} onChange={handleChange('OS')} inputProps={{ inputMode: 'numeric' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Nota Fiscal" fullWidth value={values.nf} onChange={handleChange('nf')} inputProps={{ inputMode: 'numeric' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status NF</InputLabel>
            <Select value={values.statusNf} label="Status NF" onChange={handleChange('statusNf')}>
              {NF_STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Data de Entrada"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={values.entryDate?.slice ? values.entryDate.slice(0, 10) : values.entryDate}
            onChange={handleChange('entryDate')}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
