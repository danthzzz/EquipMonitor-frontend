import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useDashboard } from '../hooks/useDashboard';
import MainLayout from '../layouts/MainLayout';
import DashboardStats from '../components/dashboard/DashboardStats';
import DashboardFilters from '../components/dashboard/DashboardFilters';
import DashboardPieChart from '../components/dashboard/DashboardPieChart';
import DashboardBarChart from '../components/dashboard/DashboardBarChart';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser] = useState(() => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  useEffect(() => {
    if (currentUser === null) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const { loading, availableYears, selectedYear, setSelectedYear, chartData, barData, totalPins } = useDashboard();

  if (currentUser === null) return null;

  return (
    <MainLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>Dashboard</Typography>
        <DashboardFilters availableYears={availableYears} selectedYear={selectedYear} onYearChange={setSelectedYear} />
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={3}>
          <DashboardStats chartData={chartData} totalPins={totalPins} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <DashboardPieChart chartData={chartData} />
            </Grid>
            <Grid item xs={12} md={7}>
              <DashboardBarChart barData={barData} />
            </Grid>
          </Grid>
        </Stack>
      )}
    </MainLayout>
  );
}
