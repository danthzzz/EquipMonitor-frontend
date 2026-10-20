import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { isPinFinalizado, getPendingPhotoLabel } from '../../utils/pinUtils';
import CameraCapture from '../photos/CameraCapture';
import UploadProgressDialog from '../photos/UploadProgressDialog';
import { uploadPinPhotos } from '../../services/photoService';
import { useSnackbar } from '../../context';
import { useIsPhone } from '../../hooks/useBreakpoints';

export default function PinActions({ pin, onFinalize, onReset, onDelete, onRefresh }) {
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(null); // 'finalize' | 'reset' | 'delete' | null
  const isPhone = useIsPhone();
  const { showSnackbar } = useSnackbar();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [progress, setProgress] = useState(null);
  const pendingLabel = getPendingPhotoLabel(pin);
  // Entry photos first; exit photos only once entry is done.
  const pendingTipo = pin.fotosEntrada === 'pendente' ? 'entrada' : 'saida';

  const handleRetake = async (blobs) => {
    setCameraOpen(false);
    setProgress({ message: 'Enviando fotos…', value: 0 });
    const result = await uploadPinPhotos(pin._id, pendingTipo, blobs, (done, total) =>
      setProgress({ message: `Foto ${done} de ${total}`, value: (done / total) * 100 })
    );
    setProgress(null);
    if (result.ok) {
      showSnackbar('Fotos enviadas.', 'success');
    } else {
      showSnackbar(result.error || 'Não foi possível enviar as fotos. Tente novamente.', 'error');
    }
    await onRefresh?.();
  };

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
      {pendingLabel && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={(
            <Button color="inherit" size="small" startIcon={<PhotoCameraIcon />} onClick={() => setCameraOpen(true)}>
              Tirar fotos agora
            </Button>
          )}
        >
          {pendingLabel}
        </Alert>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} flexWrap="wrap" useFlexGap>
        <Button startIcon={<EditIcon />} variant="outlined" fullWidth={isPhone} onClick={() => navigate(`/update/${pin._id}`)}>
          Editar
        </Button>
        {pin.status === 'Expedição' && (
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
        {pin.sharepoint?.folderUrl && (
          <Button
            startIcon={<FolderOpenIcon />}
            variant="text"
            fullWidth={isPhone}
            href={pin.sharepoint.folderUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir pasta no SharePoint
          </Button>
        )}
      </Stack>

      <CameraCapture
        open={cameraOpen}
        title={pendingTipo === 'entrada' ? 'Fotos de entrada' : 'Fotos de saída'}
        onClose={() => setCameraOpen(false)}
        onDone={handleRetake}
      />
      <UploadProgressDialog open={Boolean(progress)} message={progress?.message} value={progress?.value} />

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
