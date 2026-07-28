import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

const EMPTY_VALUES = { nome: '', serie: '', proximaCalibracaoPrevista: '' };

export default function DeviceFormDialog({ open, initialValues, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY_VALUES);

  useEffect(() => {
    if (open) {
      setValues({
        ...EMPTY_VALUES,
        ...initialValues,
        proximaCalibracaoPrevista: initialValues?.proximaCalibracaoPrevista
          ? String(initialValues.proximaCalibracaoPrevista).slice(0, 10)
          : ''
      });
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
      <DialogTitle>{initialValues ? 'Editar Device' : 'Adicionar Device'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Nome/Modelo" fullWidth required autoFocus value={values.nome} onChange={handleChange('nome')} />
            <TextField label="Número de Série" fullWidth required value={values.serie} onChange={handleChange('serie')} />
            <TextField
              label="Próxima Calibração Prevista"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={values.proximaCalibracaoPrevista}
              onChange={handleChange('proximaCalibracaoPrevista')}
            />
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
