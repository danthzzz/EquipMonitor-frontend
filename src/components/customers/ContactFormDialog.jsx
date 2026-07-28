import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputMask from 'react-input-mask';

const EMPTY_VALUES = { nome: '', cargo: '', telefone: '', email: '' };

export default function ContactFormDialog({ open, initialValues, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY_VALUES);

  useEffect(() => {
    if (open) {
      setValues({ ...EMPTY_VALUES, ...initialValues });
    }
  }, [open, initialValues]);

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues ? 'Editar Contato' : 'Adicionar Contato'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Nome" fullWidth required autoFocus value={values.nome} onChange={handleChange('nome')} />
            <TextField label="Cargo" fullWidth value={values.cargo} onChange={handleChange('cargo')} />
            <InputMask mask="(99) 99999-9999" value={values.telefone} onChange={handleChange('telefone')}>
              {(inputProps) => <TextField {...inputProps} label="Telefone" fullWidth />}
            </InputMask>
            <TextField label="E-mail" type="email" fullWidth value={values.email} onChange={handleChange('email')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
