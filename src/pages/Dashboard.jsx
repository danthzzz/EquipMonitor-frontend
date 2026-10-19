import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useDashboard } from '../hooks/useDashboard';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/common/PageHeader';
import { useIsPhone } from '../hooks/useBreakpoints';
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

  const isPhone = useIsPhone();
  const { loading, availableYears, selectedYear, setSelectedYear, chartData, barData, totalPins } = useDashboard();

  if (currentUser === null) return null;

  return (
    <MainLayout>
      <PageHeader
        title="Dashboard"
        actions={
          <DashboardFilters
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            fullWidth={isPhone}
          />
        }
      />

      {loading ? (
        <CircularProgress />
      ) : (
        // Box, not Stack: Stack's child margin reset cancels Grid's negative margins and shifts the grids right.
        <Box>
          <Box mb={{ xs: 2, md: 3 }}>
            <DashboardStats chartData={chartData} totalPins={totalPins} />
          </Box>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={5}>
              <DashboardPieChart chartData={chartData} />
            </Grid>
            <Grid item xs={12} md={7}>
              <DashboardBarChart barData={barData} />
            </Grid>
          </Grid>
        </Box>
      )}
    </MainLayout>
  );
}
