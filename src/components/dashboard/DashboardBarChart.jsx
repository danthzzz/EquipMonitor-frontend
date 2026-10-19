import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { useIsPhone } from '../../hooks/useBreakpoints';

export default function DashboardBarChart({ barData }) {
  const theme = useTheme();
  const isPhone = useIsPhone();

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>Finalizados por Mês</Typography>
      <BarChart
        height={isPhone ? 220 : 280}
        dataset={barData}
        xAxis={[{
          scaleType: 'band',
          dataKey: 'month',
          ...(isPhone && { tickLabelStyle: { angle: -45, textAnchor: 'end', fontSize: 10 } }),
        }]}
        series={[{ dataKey: 'pinCount', label: 'Equipamentos', color: theme.palette.primary.main }]}
      />
    </Paper>
  );
}
