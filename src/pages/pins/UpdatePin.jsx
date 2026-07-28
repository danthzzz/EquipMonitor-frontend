import { useNavigate, useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainLayout from '../../layouts/MainLayout';
import PinForm from '../../components/pins/PinForm';
import { usePins } from '../../hooks/usePins';
import { useEquips } from '../../hooks/useEquips';
import { useSnackbar } from '../../context';

export default function UpdatePin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pins, loading, updatePin } = usePins();
  const { equipOptions } = useEquips();
  const { showSnackbar } = useSnackbar();

  const pin = pins.find((p) => p._id === id);

  const handleSubmit = async (values) => {
    try {
      await updatePin(id, values);
      showSnackbar('Equipamento atualizado com sucesso.', 'success');
      navigate(`/pin/${id}`);
    } catch {
      showSnackbar('Não foi possível atualizar o equipamento.', 'error');
    }
  };

  return (
    <MainLayout>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>Editar Equipamento</Typography>
      </Stack>
      {loading ? (
        <CircularProgress />
      ) : !pin ? (
        <Typography>Equipamento não encontrado.</Typography>
      ) : (
        <Paper sx={{ p: 3 }}>
          <PinForm mode="update" submitLabel="Salvar" initialValues={pin} onSubmit={handleSubmit} equipOptions={equipOptions} />
        </Paper>
      )}
    </MainLayout>
  );
}
