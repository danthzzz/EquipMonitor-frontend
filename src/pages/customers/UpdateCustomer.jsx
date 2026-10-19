import { useNavigate, useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
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
      <PageHeader title="Editar Cliente" onBack={() => navigate('/allcustomers')} />
      {loading ? (
        <CircularProgress />
      ) : !customer ? (
        <Typography>Cliente não encontrado.</Typography>
      ) : (
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <CustomerForm initialValues={customer} submitLabel="Salvar" onSubmit={handleSubmit} />
        </Paper>
      )}
    </MainLayout>
  );
}
