import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
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
      <PageHeader title="Detalhe do Cliente" onBack={() => navigate('/allcustomers')} />

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} lg={3}>
          <CustomerHeaderCard customerId={id} />
        </Grid>
        <Grid item xs={12} md={7} lg={6}>
          <CalibrationHistoryList
            customerId={id}
            deviceFilter={deviceFilter}
            onDeviceFilterChange={setDeviceFilter}
          />
        </Grid>
        <Grid item xs={12} md={5} lg={3}>
          <Stack spacing={{ xs: 2, md: 3 }}>
            <ContactList customerId={id} />
            <DeviceList customerId={id} onDeviceClick={setDeviceFilter} />
          </Stack>
        </Grid>
      </Grid>
    </MainLayout>
  );
}
