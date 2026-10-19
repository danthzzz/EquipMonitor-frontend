import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import PinDetails from '../../components/pins/PinDetails';
import PinHistory from '../../components/pins/PinHistory';
import PinActions from '../../components/pins/PinActions';
import { usePins } from '../../hooks/usePins';
import { useSnackbar } from '../../context';

export default function SinglePin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pins, loading, deletePin, resetPinStatus, updateStatusDirect } = usePins();
  const { showSnackbar } = useSnackbar();

  const pin = pins.find((p) => p._id === id);

  const handleFinalize = async (targetPin, newStatus) => {
    try {
      await updateStatusDirect(targetPin, newStatus);
      showSnackbar('Equipamento finalizado com sucesso.', 'success');
    } catch {
      showSnackbar('Não foi possível finalizar o equipamento.', 'error');
    }
  };

  const handleReset = async (targetPin) => {
    try {
      await resetPinStatus(targetPin);
      showSnackbar('Status resetado com sucesso.', 'success');
    } catch {
      showSnackbar('Não foi possível resetar o status.', 'error');
    }
  };

  const handleDelete = async (targetPin) => {
    try {
      await deletePin(targetPin._id);
      showSnackbar('Equipamento excluído com sucesso.', 'success');
      navigate('/home');
    } catch {
      showSnackbar('Não foi possível excluir o equipamento.', 'error');
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Detalhe do Equipamento" onBack={() => navigate('/home')} />
      {loading ? (
        <CircularProgress />
      ) : !pin ? (
        <Typography>Equipamento não encontrado.</Typography>
      ) : (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={7}>
            <PinDetails pin={pin} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack spacing={{ xs: 2, md: 3 }}>
              <PinActions pin={pin} onFinalize={handleFinalize} onReset={handleReset} onDelete={handleDelete} />
              <PinHistory pin={pin} />
            </Stack>
          </Grid>
        </Grid>
      )}
    </MainLayout>
  );
}
