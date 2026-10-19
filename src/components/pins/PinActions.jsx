import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { isPinFinalizado } from '../../utils/pinUtils';
import { useIsPhone } from '../../hooks/useBreakpoints';

export default function PinActions({ pin, onFinalize, onReset, onDelete }) {
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(null); // 'finalize' | 'reset' | 'delete' | null
  const isPhone = useIsPhone();

  const finalizado = isPinFinalizado(pin);

  const closeDialog = () => setDialog(null);

  const handleConfirm = async () => {
    if (dialog === 'finalize') await onFinalize(pin, 'Finalizado');
    if (dialog === 'reset') await onReset(pin);
    if (dialog === 'delete') await onDelete(pin);
    closeDialog();
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} flexWrap="wrap" useFlexGap>
        <Button startIcon={<EditIcon />} variant="outlined" fullWidth={isPhone} onClick={() => navigate(`/update/${pin._id}`)}>
          Editar
        </Button>
        {!finalizado && (
          <Button startIcon={<CheckCircleIcon />} variant="contained" color="success" fullWidth={isPhone} onClick={() => setDialog('finalize')}>
            Finalizar
          </Button>
        )}
        {finalizado && (
          <Button startIcon={<RestartAltIcon />} variant="outlined" color="warning" fullWidth={isPhone} onClick={() => setDialog('reset')}>
            Resetar
          </Button>
        )}
        <Button startIcon={<DeleteIcon />} variant="outlined" color="error" fullWidth={isPhone} onClick={() => setDialog('delete')}>
          Excluir
        </Button>
      </Stack>

      <ConfirmationDialog
        open={dialog === 'finalize'}
        title="Confirmar Finalização"
        message="Deseja marcar este equipamento como finalizado?"
        onClose={closeDialog}
        onConfirm={handleConfirm}
        confirmColor="success"
        confirmText="Sim, Finalizar"
      />
      <ConfirmationDialog
        open={dialog === 'reset'}
        title="Confirmar Reset"
        message="Você recebeu este equipamento novamente? Isso irá resetar o status para 'Recebido' e limpará os dados."
        onClose={closeDialog}
        onConfirm={handleConfirm}
        confirmColor="warning"
        confirmText="Sim, Resetar"
      />
      <ConfirmationDialog
        open={dialog === 'delete'}
        title="Confirmar Exclusão"
        message="Deseja realmente excluir este equipamento? Esta ação não pode ser desfeita."
        onClose={closeDialog}
        onConfirm={handleConfirm}
        confirmColor="error"
        confirmText="Sim, Excluir"
      />
    </Paper>
  );
}
