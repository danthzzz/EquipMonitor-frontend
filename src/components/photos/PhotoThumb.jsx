import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Square thumbnail of an in-memory photo; the object URL is released on unmount.
export default function PhotoThumb({ blob, size = 72, onRemove }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {url && (
        <Box component="img" src={url} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }} />
      )}
      {onRemove && (
        <IconButton
          aria-label="Remover foto"
          size="small"
          onClick={onRemove}
          sx={{ position: 'absolute', top: 2, right: 2, p: 0.25, bgcolor: 'rgba(0,0,0,0.55)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' } }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>
  );
}
