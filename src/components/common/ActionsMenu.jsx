import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// ⋮ menu for list cards. Clicks never bubble, so the card's own onClick doesn't fire.
export default function ActionsMenu({ items }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event?.stopPropagation?.();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label="Ações" onClick={handleOpen} edge="end">
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} onClick={(e) => e.stopPropagation()}>
        {items.map(({ key, label, icon: Icon, color, onClick }) => (
          <MenuItem
            key={key}
            onClick={(event) => {
              handleClose(event);
              onClick();
            }}
            sx={color ? { color: `${color}.main` } : undefined}
          >
            {Icon && (
              <ListItemIcon sx={color ? { color: `${color}.main` } : undefined}>
                <Icon fontSize="small" />
              </ListItemIcon>
            )}
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
