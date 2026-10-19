import Box from '@mui/material/Box';

// One column on phones, two on portrait tablets.
export default function CardGrid({ children }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
      {children}
    </Box>
  );
}
