import { useState } from 'react';
import Box from '@mui/material/Box';
import ResponsiveDialog from '../common/ResponsiveDialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

const EMPTY_VALUES = { modelo: '', codigo: '', tipo: 'ALI' };

export default function EquipForm({ open, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY_VALUES);

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
    setValues(EMPTY_VALUES);
  };

  return (
    <ResponsiveDialog open={open} onClose={onClose}>
      <DialogTitle>Novo Equipamento</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Modelo" required fullWidth value={values.modelo} onChange={handleChange('modelo')} />
            <TextField label="Código" required fullWidth value={values.codigo} onChange={handleChange('codigo')} />
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select value={values.tipo} label="Tipo" onChange={handleChange('tipo')}>
                <MenuItem value="ALI">ALI</MenuItem>
                <MenuItem value="CM">CM</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Adicionar</Button>
        </DialogActions>
      </Box>
    </ResponsiveDialog>
  );
}
