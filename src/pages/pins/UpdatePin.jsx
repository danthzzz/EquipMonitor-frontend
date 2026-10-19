import { useNavigate, useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
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
      <PageHeader title="Editar Equipamento" onBack={() => navigate(-1)} />
      {loading ? (
        <CircularProgress />
      ) : !pin ? (
        <Typography>Equipamento não encontrado.</Typography>
      ) : (
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <PinForm mode="update" submitLabel="Salvar" initialValues={pin} onSubmit={handleSubmit} equipOptions={equipOptions} />
        </Paper>
      )}
    </MainLayout>
  );
}
