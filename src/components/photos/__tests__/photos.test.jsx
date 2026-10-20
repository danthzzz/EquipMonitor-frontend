import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/renderWithProviders';
import CameraCapture from '../CameraCapture';
import PhotoField, { MIN_PHOTOS } from '../PhotoField';
import * as imageResize from '../../../utils/imageResize';

const blob = () => new Blob([new Uint8Array([0xff, 0xd8])], { type: 'image/jpeg' });
const blobs = (n) => Array.from({ length: n }, blob);

let originalMediaDevices;
beforeEach(() => {
  originalMediaDevices = navigator.mediaDevices;
});
afterEach(() => {
  Object.defineProperty(navigator, 'mediaDevices', { value: originalMediaDevices, configurable: true });
});

const setMediaDevices = (value) => Object.defineProperty(navigator, 'mediaDevices', { value, configurable: true });

describe('CameraCapture', () => {
  it('falls back to the phone camera when getUserMedia is missing', async () => {
    setMediaDevices(undefined);
    renderWithProviders(<CameraCapture open title="Fotos de entrada" onClose={vi.fn()} onDone={vi.fn()} />, { width: 375 });
    expect(await screen.findByText('Câmera indisponível no navegador')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Usar câmera do celular' })).toBeInTheDocument();
  });

  it('falls back when the camera permission is denied', async () => {
    const error = Object.assign(new Error('denied'), { name: 'NotAllowedError' });
    setMediaDevices({ getUserMedia: vi.fn().mockRejectedValue(error) });
    renderWithProviders(<CameraCapture open title="Fotos de entrada" onClose={vi.fn()} onDone={vi.fn()} />, { width: 375 });
    expect(await screen.findByText('Câmera indisponível no navegador')).toBeInTheDocument();
  });

  it('enables Concluir only from 5 photos and returns them', async () => {
    setMediaDevices(undefined);
    const onDone = vi.fn();
    const { unmount } = renderWithProviders(
      <CameraCapture open title="Fotos de entrada" onClose={vi.fn()} onDone={onDone} initialPhotos={blobs(4)} />,
      { width: 375 }
    );
    expect(screen.getByRole('button', { name: /concluir/i })).toBeDisabled();
    unmount();

    renderWithProviders(
      <CameraCapture open title="Fotos de entrada" onClose={vi.fn()} onDone={onDone} initialPhotos={blobs(5)} />,
      { width: 375 }
    );
    await userEvent.click(screen.getByRole('button', { name: /concluir/i }));
    expect(onDone).toHaveBeenCalledWith(expect.any(Array));
    expect(onDone.mock.calls[0][0]).toHaveLength(5);
  });

  it('shows which photo comes next', () => {
    setMediaDevices(undefined);
    renderWithProviders(
      <CameraCapture open title="Fotos de entrada" onClose={vi.fn()} onDone={vi.fn()} initialPhotos={blobs(2)} />,
      { width: 375 }
    );
    expect(screen.getByText('Foto 3 de 5')).toBeInTheDocument();
  });

  it('stops the camera tracks when closed', async () => {
    const stop = vi.fn();
    setMediaDevices({ getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] }) });
    const { rerender } = renderWithProviders(
      <CameraCapture open title="Fotos de entrada" onClose={vi.fn()} onDone={vi.fn()} />,
      { width: 375 }
    );
    await waitFor(() => expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled());
    rerender(<CameraCapture open={false} title="Fotos de entrada" onClose={vi.fn()} onDone={vi.fn()} />);
    await waitFor(() => expect(stop).toHaveBeenCalled());
  });
});

describe('PhotoField', () => {
  it('exports the minimum of 5 photos', () => {
    expect(MIN_PHOTOS).toBe(5);
  });

  it('shows how many photos are still missing', () => {
    renderWithProviders(<PhotoField title="Fotos de entrada" photos={blobs(3)} onChange={vi.fn()} />, { width: 375 });
    expect(screen.getByText('3 de 5 fotos mínimas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fotografar equipamento' })).toBeInTheDocument();
  });

  it('removes a photo', async () => {
    const onChange = vi.fn();
    const photos = blobs(3);
    renderWithProviders(<PhotoField title="Fotos de entrada" photos={photos} onChange={onChange} />, { width: 375 });
    await userEvent.click(screen.getAllByRole('button', { name: 'Remover foto' })[0]);
    expect(onChange).toHaveBeenCalledWith([photos[1], photos[2]]);
  });
});

describe('CameraCapture robustness', () => {
  it('offers the phone camera while the browser camera is still starting', async () => {
    setMediaDevices({ getUserMedia: vi.fn(() => new Promise(() => {})) });
    renderWithProviders(<CameraCapture open title="Fotos de entrada" onClose={vi.fn()} onDone={vi.fn()} />, { width: 375 });
    expect(screen.getByText('Abrindo câmera…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Usar câmera do celular' })).toBeInTheDocument();
  });

  it('tells the user when a chosen photo cannot be processed', async () => {
    setMediaDevices(undefined);
    vi.spyOn(imageResize, 'fileToResizedJpeg').mockRejectedValue(new Error('formato'));
    renderWithProviders(<CameraCapture open title="Fotos de entrada" onClose={vi.fn()} onDone={vi.fn()} />, { width: 375 });
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [new File(['x'], 'foto.heic', { type: 'image/heic' })] } });
    expect(await screen.findByText('Não foi possível processar a foto. Tente novamente.')).toBeInTheDocument();
  });
});
