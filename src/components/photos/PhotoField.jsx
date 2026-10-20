import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CameraCapture from './CameraCapture';
import PhotoThumb from './PhotoThumb';
import { MIN_PHOTOS } from './constants';

export { MIN_PHOTOS };

// "Fotos de entrada/saída" block of a form: opens the camera and shows the taken photos.
export default function PhotoField({ title, photos, onChange, min = MIN_PHOTOS, disabled = false }) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const enough = photos.length >= min;

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title.toUpperCase()}
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={1}>
        {photos.map((blob, index) => (
          <PhotoThumb key={index} blob={blob} onRemove={disabled ? undefined : () => onChange(photos.filter((_, i) => i !== index))} />
        ))}
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
        <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={() => setCameraOpen(true)} disabled={disabled}>
          Fotografar equipamento
        </Button>
        <Typography variant="body2" color={enough ? 'success.main' : 'error.main'} fontWeight={600}>
          {`${photos.length} de ${min} fotos mínimas`}
        </Typography>
      </Stack>

      <CameraCapture
        open={cameraOpen}
        title={title}
        min={min}
        initialPhotos={photos}
        onClose={() => setCameraOpen(false)}
        onDone={(all) => {
          onChange(all);
          setCameraOpen(false);
        }}
      />
    </Box>
  );
}
