import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainLayout from '../../layouts/MainLayout';
import CustomerHeaderCard from '../../components/customers/CustomerHeaderCard';
import CalibrationHistoryList from '../../components/customers/CalibrationHistoryList';
import ContactList from '../../components/customers/ContactList';
import DeviceList from '../../components/customers/DeviceList';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deviceFilter, setDeviceFilter] = useState(null);

  return (
    <MainLayout>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <IconButton onClick={() => navigate('/allcustomers')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>Detalhe do Cliente</Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <CustomerHeaderCard customerId={id} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CalibrationHistoryList
            customerId={id}
            deviceFilter={deviceFilter}
            onDeviceFilterChange={setDeviceFilter}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack spacing={3}>
            <ContactList customerId={id} />
            <DeviceList customerId={id} onDeviceClick={setDeviceFilter} />
          </Stack>
        </Grid>
      </Grid>
    </MainLayout>
  );
}
