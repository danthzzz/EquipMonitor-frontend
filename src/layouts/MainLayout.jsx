import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import Sidebar from '../components/sidebar/Sidebar';

const DRAWER_WIDTH = 240;

// Longhand paddings per breakpoint, so the Fab clearance (pb 11) is not overridden
// by a later `p` shorthand at sm. Fab/cards are shown below md.
export function getMainPadding(bottomSpace) {
  return {
    pt: { xs: 1.5, sm: 2, md: 3 },
    px: { xs: 1.5, sm: 2, md: 3 },
    pb: bottomSpace ? { xs: 11, sm: 11, md: 3 } : { xs: 1.5, sm: 2, md: 3 },
  };
}

export default function MainLayout({ children, sx = {}, bottomSpace = false }) {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ display: { xs: 'flex', md: 'none' }, zIndex: theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={700}>
            EquipMonitor
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Sidebar />
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          ...getMainPadding(bottomSpace),
          mt: { xs: 7, md: 0 },
          bgcolor: 'background.default',
          minHeight: '100vh',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ...sx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
