// frontend1/src/components/customers/CustomerHeaderCard.jsx
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useCustomerDetail } from '../../hooks/useCustomerDetail';

export default function CustomerHeaderCard({ customerId }) {
  const { customer, loading, error, refresh } = useCustomerDetail(customerId);

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width="70%" height={40} />
        <Skeleton variant="text" width="50%" />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>Não foi possível carregar os dados do cliente.</Alert>
        <Button size="small" onClick={refresh}>Tentar novamente</Button>
      </Paper>
    );
  }

  if (!customer) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Cliente não encontrado.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={600}>{customer.empresa}</Typography>
        <Typography variant="body2" color="text.secondary">CNPJ: {customer.cnpj}</Typography>
      </Stack>
    </Paper>
  );
}
