import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainLayout from '../../layouts/MainLayout';
import CustomerForm from '../../components/customers/CustomerForm';
import { useCustomers } from '../../hooks/useCustomers';
import { useSnackbar } from '../../context';

export default function CreateCustomer() {
  const navigate = useNavigate();
  const { createCustomer } = useCustomers();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (values) => {
    try {
      const created = await createCustomer(values);
      showSnackbar('Cliente cadastrado com sucesso.', 'success');
      navigate(`/customer/${created._id}`);
    } catch {
      showSnackbar('Não foi possível cadastrar o cliente.', 'error');
    }
  };

  return (
    <MainLayout>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <IconButton onClick={() => navigate('/allcustomers')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>Novo Cliente</Typography>
      </Stack>
      <Paper sx={{ p: 3 }}>
        <CustomerForm submitLabel="Cadastrar" onSubmit={handleSubmit} />
      </Paper>
    </MainLayout>
  );
}
