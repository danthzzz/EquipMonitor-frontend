import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import MainLayout from '../../layouts/MainLayout';
import CustomerTable from '../../components/customers/CustomerTable';
import SearchField from '../../components/common/SearchField';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { useCustomers } from '../../hooks/useCustomers';
import { useSnackbar } from '../../context';

export default function Customers() {
  const navigate = useNavigate();
  const { customers, loading, deleteCustomer } = useCustomers();
  const { showSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return customers;
    return customers.filter((c) =>
      [c.empresa, c.cnpj].some((field) => String(field || '').toLowerCase().includes(term))
    );
  }, [customers, searchTerm]);

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      try {
        const result = await deleteCustomer(customerToDelete._id);
        const orphaned = (result?.orphanedContacts || 0) + (result?.orphanedDevices || 0);
        if (orphaned > 0) {
          showSnackbar(
            `Cliente excluído. Atenção: ${result.orphanedContacts} contato(s) e ${result.orphanedDevices} device(s) vinculados ficaram órfãos.`,
            'warning'
          );
        } else {
          showSnackbar('Cliente excluído com sucesso.', 'success');
        }
      } catch {
        showSnackbar('Não foi possível excluir o cliente.', 'error');
      }
      setCustomerToDelete(null);
    }
  };

  return (
    <MainLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>Clientes</Typography>
        <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/createcustomer">
          Adicionar
        </Button>
      </Stack>
      <Paper sx={{ p: 2, mb: 3 }}>
        <SearchField value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por empresa ou CNPJ..." />
      </Paper>
      <Paper>
        <CustomerTable
          customers={filteredCustomers}
          loading={loading}
          onView={(customer) => navigate(`/customer/${customer._id}`)}
          onEdit={(customer) => navigate(`/updatecustomer/${customer._id}`)}
          onDelete={setCustomerToDelete}
        />
      </Paper>
      <ConfirmationDialog
        open={Boolean(customerToDelete)}
        title="Confirmar Exclusão"
        message="Deseja realmente excluir este cliente? Esta ação não pode ser desfeita."
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleConfirmDelete}
        confirmColor="error"
        confirmText="Sim, Excluir"
      />
    </MainLayout>
  );
}
