import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import AddIcon from '@mui/icons-material/Add';
import MainLayout from '../../layouts/MainLayout';
import CustomerTable from '../../components/customers/CustomerTable';
import CustomerCard from '../../components/customers/CustomerCard';
import CardGrid from '../../components/common/CardGrid';
import EmptyState from '../../components/common/EmptyState';
import AddFab from '../../components/common/AddFab';
import PageHeader from '../../components/common/PageHeader';
import SearchField from '../../components/common/SearchField';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { useCustomers } from '../../hooks/useCustomers';
import { useSnackbar } from '../../context';
import { useIsCompact } from '../../hooks/useBreakpoints';

export default function Customers() {
  const navigate = useNavigate();
  const { customers, loading, deleteCustomer } = useCustomers();
  const { showSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const isCompact = useIsCompact();

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

  const listHandlers = {
    onView: (customer) => navigate(`/customer/${customer._id}`),
    onEdit: (customer) => navigate(`/updatecustomer/${customer._id}`),
    onDelete: setCustomerToDelete,
  };

  return (
    <MainLayout bottomSpace={isCompact}>
      <PageHeader
        title="Clientes"
        actions={!isCompact && (
          <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/createcustomer">
            Adicionar
          </Button>
        )}
      />
      <Paper sx={{ p: { xs: 1.5, md: 2 }, mb: { xs: 2, md: 3 } }}>
        <SearchField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por empresa ou CNPJ..."
          sx={isCompact ? { width: '100%' } : {}}
        />
      </Paper>
      {isCompact ? (
        loading ? (
          <Stack spacing={1}>
            <Skeleton variant="rounded" height={64} />
            <Skeleton variant="rounded" height={64} />
          </Stack>
        ) : filteredCustomers.length === 0 ? (
          <EmptyState title="Nenhum cliente encontrado" description="Cadastre um novo cliente para começar." />
        ) : (
          <CardGrid>
            {filteredCustomers.map((customer) => (
              <CustomerCard key={customer._id} customer={customer} {...listHandlers} />
            ))}
          </CardGrid>
        )
      ) : (
        <Paper>
          <CustomerTable customers={filteredCustomers} loading={loading} {...listHandlers} />
        </Paper>
      )}
      <AddFab to="/createcustomer" />
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
