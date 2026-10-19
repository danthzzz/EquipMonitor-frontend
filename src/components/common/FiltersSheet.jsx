import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Bottom sheet holding list filters on compact screens. Filters apply live;
// "Aplicar" only closes the sheet.
export default function FiltersSheet({ open, onClose, onClear, children }) {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen
      PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}
    >
      <Box sx={{ p: 2, pb: 3 }}>
        <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider', mx: 'auto', mb: 2 }} />
        <Typography variant="subtitle1" fontWeight={700} mb={2}>Filtros</Typography>
        <Stack spacing={2}>{children}</Stack>
        <Stack direction="row" spacing={1} mt={3}>
          <Button fullWidth variant="outlined" onClick={onClear}>Limpar</Button>
          <Button fullWidth variant="contained" onClick={onClose}>Aplicar</Button>
        </Stack>
      </Box>
    </SwipeableDrawer>
  );
}
