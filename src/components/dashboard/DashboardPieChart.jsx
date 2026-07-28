import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTheme } from '@mui/material/styles';

const STATUS_KEY_TO_PALETTE_PATH = {
  alert: (p) => p.warning.main,
  alarm: (p) => p.error.main,
  finish: (p) => p.success.main,
  notCounted: (p) => p.warning.dark,
  normal: (p) => p.grey[500],
};

export default function DashboardPieChart({ chartData }) {
  const theme = useTheme();

  const series = chartData
    .filter((item) => item.value > 0)
    .map((item) => ({
      id: item.statusKey,
      label: item.label,
      value: item.value,
      color: STATUS_KEY_TO_PALETTE_PATH[item.statusKey](theme.palette),
    }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>Distribuição por Status</Typography>
      <PieChart series={[{ data: series, innerRadius: 40 }]} height={280} />
    </Paper>
  );
}
