import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useIsPhone } from '../../hooks/useBreakpoints';

export default function PageHeader({ title, onBack, actions }) {
  const isPhone = useIsPhone();

  return (
    <Stack direction="row" alignItems="center" spacing={1} mb={{ xs: 2, md: 3 }} flexWrap="wrap" useFlexGap>
      {onBack && (
        <IconButton onClick={onBack} aria-label="Voltar">
          <ArrowBackIcon />
        </IconButton>
      )}
      <Typography variant="h5" component="h1" fontWeight={600} sx={{ flexGrow: 1, ...(isPhone && { fontSize: '1.15rem' }) }}>
        {title}
      </Typography>
      {actions && <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>{actions}</Box>}
    </Stack>
  );
}
