import { useNavigate, useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainLayout from '../../layouts/MainLayout';
import CustomerForm from '../../components/customers/CustomerForm';
import { useCustomers } from '../../hooks/useCustomers';
import { useSnackbar } from '../../context';

export default function UpdateCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, loading, updateCustomer } = useCustomers();
  const { showSnackbar } = useSnackbar();

  const customer = customers.find((c) => c._id === id);

  const handleSubmit = async (values) => {
    try {
      await updateCustomer(id, values);
      showSnackbar('Cliente atualizado com sucesso.', 'success');
      navigate('/allcustomers');
    } catch {
      showSnackbar('Não foi possível atualizar o cliente.', 'error');
    }
  };

  return (
    <MainLayout>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <IconButton onClick={() => navigate('/allcustomers')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>Editar Cliente</Typography>
      </Stack>
      {loading ? (
        <CircularProgress />
      ) : !customer ? (
        <Typography>Cliente não encontrado.</Typography>
      ) : (
        <Paper sx={{ p: 3 }}>
          <CustomerForm initialValues={customer} submitLabel="Salvar" onSubmit={handleSubmit} />
        </Paper>
      )}
    </MainLayout>
  );
}
