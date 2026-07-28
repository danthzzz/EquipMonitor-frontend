import { Link, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/Inbox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useUserContext, useThemeMode } from '../../context';

const NAV_ITEMS = [
  { label: 'Início', to: '/home', icon: InboxIcon },
  { label: 'Dashboard', to: '/dash', icon: DashboardIcon },
  { label: 'Rastreio', to: '/track', icon: TravelExploreIcon },
  { label: 'Equipamentos', to: '/allequips', icon: PrecisionManufacturingIcon },
  { label: 'Clientes', to: '/allcustomers', icon: GroupsIcon },
];

export default function Sidebar({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, setUserData } = useUserContext();
  const { mode, toggleMode } = useThemeMode();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          EquipMonitor
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <ListItemButton
            key={to}
            component={Link}
            to={to}
            selected={location.pathname === to}
            onClick={onNavigate}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
          {userData?.name || 'Usuário'}
        </Typography>
        <Box>
          <Tooltip title={mode === 'light' ? 'Tema escuro' : 'Tema claro'}>
            <IconButton size="small" onClick={toggleMode}>
              {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Sair">
            <IconButton size="small" onClick={handleLogout}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
