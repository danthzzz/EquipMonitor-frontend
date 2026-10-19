import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
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
      <PageHeader title="Novo Cliente" onBack={() => navigate('/allcustomers')} />
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <CustomerForm submitLabel="Cadastrar" onSubmit={handleSubmit} />
      </Paper>
    </MainLayout>
  );
}
