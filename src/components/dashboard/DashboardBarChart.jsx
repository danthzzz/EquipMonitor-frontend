import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

export default function DashboardBarChart({ barData }) {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>Finalizados por Mês</Typography>
      <BarChart
        height={280}
        dataset={barData}
        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
        series={[{ dataKey: 'pinCount', label: 'Equipamentos', color: theme.palette.primary.main }]}
      />
    </Paper>
  );
}
