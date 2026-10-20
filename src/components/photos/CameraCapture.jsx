import { useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PhotoThumb from './PhotoThumb';
import { MIN_PHOTOS } from './constants';
import { toResizedJpeg, fileToResizedJpeg } from '../../utils/imageResize';

// Full-screen continuous camera: shoot several photos in a row, then "Concluir".
// Photos stay in memory (Blobs) — nothing is saved to the phone's gallery.
export default function CameraCapture({ open, title, onClose, onDone, min = MIN_PHOTOS, initialPhotos = [] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [camera, setCamera] = useState('starting'); // 'starting' | 'ready' | 'unavailable'
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setPhotos(initialPhotos);
    setError('');
    let cancelled = false;

    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera('unavailable');
      return undefined;
    }

    setCamera('starting');
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCamera('ready');
      })
      .catch(() => {
        if (!cancelled) setCamera('unavailable');
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
    // initialPhotos is read only when the camera opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const PROCESS_ERROR = 'Não foi possível processar a foto. Tente novamente.';

  const takePhoto = async () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    try {
      const blob = await toResizedJpeg(video, video.videoWidth, video.videoHeight);
      setPhotos((prev) => [...prev, blob]);
      setError('');
    } catch {
      setError(PROCESS_ERROR);
    }
  };

  const addFiles = async (event) => {
    const files = [...(event.target.files || [])];
    event.target.value = '';
    try {
      const blobs = await Promise.all(files.map(fileToResizedJpeg));
      setPhotos((prev) => [...prev, ...blobs]);
      setError('');
    } catch {
      setError(PROCESS_ERROR);
    }
  };

  const nativeCameraButton = (
    <Button variant="contained" component="label" startIcon={<PhotoCameraIcon />}>
      Usar câmera do celular
      <input hidden type="file" accept="image/*" capture="environment" onChange={addFiles} />
    </Button>
  );

  const counter = photos.length < min ? `Foto ${photos.length + 1} de ${min}` : `${photos.length} fotos ✓`;

  return (
    <Dialog open={open} onClose={onClose} fullScreen PaperProps={{ sx: { bgcolor: '#111', color: '#fff' } }}>
      <Stack sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.5 }}>
          <Button color="inherit" onClick={onClose}>Cancelar</Button>
          <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>{title}</Typography>
          <Typography variant="subtitle2" fontWeight={700} color={photos.length >= min ? 'success.light' : 'inherit'}>
            {counter}
          </Typography>
        </Stack>

        <Box sx={{ position: 'relative', flexGrow: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000' }}>
          {camera === 'unavailable' ? (
            <Stack spacing={2} alignItems="center" sx={{ p: 3, textAlign: 'center' }}>
              <Typography>Câmera indisponível no navegador</Typography>
              {nativeCameraButton}
            </Stack>
          ) : (
            <Box component="video" ref={videoRef} autoPlay playsInline muted sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          )}
          {camera === 'starting' && (
            // Some in-app browsers never answer the permission prompt: offer the native camera meanwhile.
            <Stack spacing={2} alignItems="center" sx={{ position: 'absolute', p: 3, textAlign: 'center' }}>
              <Typography>Abrindo câmera…</Typography>
              {nativeCameraButton}
            </Stack>
          )}
        </Box>

        <Stack spacing={1.5} sx={{ p: 1.5 }}>
          {error && <Typography variant="body2" color="error.light">{error}</Typography>}
          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', minHeight: 56 }}>
            {photos.map((blob, index) => (
              <PhotoThumb
                key={index}
                blob={blob}
                size={56}
                onRemove={() => setPhotos((prev) => prev.filter((_, i) => i !== index))}
              />
            ))}
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box sx={{ width: 120 }} />
            <IconButton
              aria-label="Tirar foto"
              onClick={takePhoto}
              disabled={camera !== 'ready'}
              sx={{ width: 68, height: 68, border: '4px solid #fff', color: '#fff', '&.Mui-disabled': { opacity: 0.3, borderColor: '#fff' } }}
            >
              <PhotoCameraIcon />
            </IconButton>
            <Button variant="contained" color="success" disabled={photos.length < min} onClick={() => onDone(photos)} sx={{ width: 120 }}>
              Concluir
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
}
