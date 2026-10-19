import Box from '@mui/material/Box';
import CardGrid from '../common/CardGrid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import EmptyState from '../common/EmptyState';
import PinCard from './PinCard';

export default function PinCardList({ pins, loading, statusFilter, ...handlers }) {
  if (loading) {
    return (
      <CardGrid>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={110} />
        ))}
      </CardGrid>
    );
  }

  if (pins.length === 0) {
    return (
      <EmptyState
        title="Nenhum equipamento encontrado"
        description="Ajuste os filtros ou cadastre um novo equipamento."
      />
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        {pins.length} {pins.length === 1 ? 'equipamento' : 'equipamentos'}
      </Typography>
      <CardGrid>
        {pins.map((pin) => (
          <PinCard key={pin._id} pin={pin} statusFilter={statusFilter} {...handlers} />
        ))}
      </CardGrid>
    </Box>
  );
}
