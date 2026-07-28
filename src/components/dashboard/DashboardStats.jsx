import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { getSemanticColor, ALERT_LEVEL_SEMANTIC } from '../../constants/colors';

const getBorderColor = (statusKey) => {
  const color = getSemanticColor(ALERT_LEVEL_SEMANTIC, statusKey);
  return color === 'default' ? 'divider' : `${color}.main`;
};

export default function DashboardStats({ chartData, totalPins }) {
  return (
    <Grid container spacing={2}>
      {chartData.map((item) => (
        <Grid item xs={6} sm={4} md={2.4} key={item.statusKey}>
          <Paper
            sx={{
              p: 2,
              borderLeft: 4,
              borderColor: getBorderColor(item.statusKey),
            }}
          >
            <Typography variant="caption" color="text.secondary">{item.label}</Typography>
            <Typography variant="h5" fontWeight={700}>{item.value}</Typography>
          </Paper>
        </Grid>
      ))}
      <Grid item xs={6} sm={4} md={2.4}>
        <Paper sx={{ p: 2, borderLeft: 4, borderColor: 'primary.main' }}>
          <Typography variant="caption" color="text.secondary">Total</Typography>
          <Typography variant="h5" fontWeight={700}>{totalPins}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
