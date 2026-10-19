import { Link } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useIsCompact } from '../../hooks/useBreakpoints';

export default function AddFab({ label = 'Adicionar', to, onClick }) {
  const isCompact = useIsCompact();
  if (!isCompact) return null;

  const linkProps = to ? { component: Link, to } : { onClick };

  return (
    <Fab
      variant="extended"
      color="success"
      {...linkProps}
      sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: (theme) => theme.zIndex.speedDial }}
    >
      <AddIcon sx={{ mr: 1 }} />
      {label}
    </Fab>
  );
}
