import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import PinForm from '../../components/pins/PinForm';
import UploadProgressDialog from '../../components/photos/UploadProgressDialog';
import { uploadPinPhotos } from '../../services/photoService';
import { usePins } from '../../hooks/usePins';
import { useEquips } from '../../hooks/useEquips';
import { useSnackbar } from '../../context';

export default function UpdatePin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pins, loading, updatePin } = usePins();
  const { equipOptions } = useEquips();
  const { showSnackbar } = useSnackbar();
  const [progress, setProgress] = useState(null);
  const [saving, setSaving] = useState(false);
  // A ref, not just state: a double tap fires the second submit before React re-renders.
  const savingRef = useRef(false);

  const pin = pins.find((p) => p._id === id);

  const handleSubmit = async (values, extra) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      await saveWithPhotos(values, extra);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const saveWithPhotos = async (values, { fotosSaida = [] } = {}) => {
    try {
      await updatePin(id, values);
    } catch (err) {
      showSnackbar(err?.response?.data?.error || 'Não foi possível atualizar o equipamento.', 'error');
      return;
    }

    if (fotosSaida.length > 0) {
      setProgress({ message: 'Enviando fotos de saída…', value: 0 });
      const result = await uploadPinPhotos(id, 'saida', fotosSaida, (done, total) =>
        setProgress({ message: `Foto ${done} de ${total}`, value: (done / total) * 100 })
      );
      setProgress(null);
      if (!result.ok) {
        showSnackbar('Status salvo, mas as fotos de saída ficaram pendentes.', 'warning');
        navigate(`/pin/${id}`);
        return;
      }
    }

    showSnackbar('Equipamento atualizado com sucesso.', 'success');
    navigate(`/pin/${id}`);
  };

  return (
    <MainLayout>
      <PageHeader title="Editar Equipamento" onBack={() => navigate(-1)} />
      {loading ? (
        <CircularProgress />
      ) : !pin ? (
        <Typography>Equipamento não encontrado.</Typography>
      ) : (
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <PinForm mode="update" submitLabel="Salvar" initialValues={pin} onSubmit={handleSubmit} equipOptions={equipOptions} submitting={saving} />
        </Paper>
      )}
      <UploadProgressDialog open={Boolean(progress)} message={progress?.message} value={progress?.value} />
    </MainLayout>
  );
}
