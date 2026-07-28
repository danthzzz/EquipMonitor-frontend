import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputMask from 'react-input-mask';

const EMPTY_VALUES = { cnpj: '', empresa: '' };

export default function CustomerForm({ initialValues, onSubmit, submitLabel = 'Salvar' }) {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues });

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField label="Empresa" fullWidth required value={values.empresa} onChange={handleChange('empresa')} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputMask mask="99.999.999/9999-99" value={values.cnpj} onChange={handleChange('cnpj')}>
            {(inputProps) => <TextField {...inputProps} label="CNPJ" fullWidth required />}
          </InputMask>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" size="large">{submitLabel}</Button>
        </Grid>
      </Grid>
    </Box>
  );
}
