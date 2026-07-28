import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainLayout from '../../layouts/MainLayout';
import PinForm from '../../components/pins/PinForm';
import { usePins } from '../../hooks/usePins';
import { useEquips } from '../../hooks/useEquips';
import { useSnackbar } from '../../context';

export default function CreatePin() {
  const navigate = useNavigate();
  const { createPin } = usePins();
  const { equipOptions } = useEquips();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (values) => {
    try {
      await createPin(values);
      showSnackbar('Equipamento cadastrado com sucesso.', 'success');
      navigate('/home');
    } catch {
      showSnackbar('Não foi possível cadastrar o equipamento.', 'error');
    }
  };

  return (
    <MainLayout>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <IconButton onClick={() => navigate('/home')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>Novo Equipamento</Typography>
      </Stack>
      <Paper sx={{ p: 3 }}>
        <PinForm mode="create" submitLabel="Cadastrar" onSubmit={handleSubmit} equipOptions={equipOptions} />
      </Paper>
    </MainLayout>
  );
}
