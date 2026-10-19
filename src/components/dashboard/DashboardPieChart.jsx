import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTheme } from '@mui/material/styles';
import { useIsPhone } from '../../hooks/useBreakpoints';

const STATUS_KEY_TO_PALETTE_PATH = {
  alert: (p) => p.warning.main,
  alarm: (p) => p.error.main,
  finish: (p) => p.success.main,
  notCounted: (p) => p.warning.dark,
  normal: (p) => p.grey[500],
};

export default function DashboardPieChart({ chartData }) {
  const theme = useTheme();
  const isPhone = useIsPhone();

  const series = chartData
    .filter((item) => item.value > 0)
    .map((item) => ({
      id: item.statusKey,
      label: item.label,
      value: item.value,
      color: STATUS_KEY_TO_PALETTE_PATH[item.statusKey](theme.palette),
    }));

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>Distribuição por Status</Typography>
      <PieChart
        series={[{ data: series, innerRadius: 40 }]}
        height={isPhone ? 300 : 280}
        margin={isPhone ? { top: 10, bottom: 90, left: 10, right: 10 } : undefined}
        slotProps={isPhone ? { legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' } } } : undefined}
      />
    </Paper>
  );
}
