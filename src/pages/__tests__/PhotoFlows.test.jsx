import { screen, fireEvent, waitFor, within, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/renderWithProviders';
import PinForm from '../../components/pins/PinForm';
import PinActions from '../../components/pins/PinActions';
import PinCard from '../../components/pins/PinCard';
import { usePins } from '../../hooks/usePins';

const mocks = vi.hoisted(() => ({
  uploadPinPhotos: vi.fn(),
  showSnackbar: vi.fn(),
  updatePin: vi.fn(),
}));

vi.mock('../../hooks/useCustomers', () => ({ useCustomers: () => ({ customers: [] }) }));
vi.mock('../../hooks/useDevices', () => ({ useDevices: () => ({ devices: [], createDevice: vi.fn() }) }));
vi.mock('../../hooks/useEquips', () => ({ useEquips: () => ({ equipOptions: [] }) }));
vi.mock('../../services/photoService', () => ({ uploadPinPhotos: mocks.uploadPinPhotos }));
vi.mock('../../services/pinService', () => ({
  pinService: { getPins: vi.fn().mockResolvedValue([]), updatePin: mocks.updatePin },
}));
vi.mock('../../context', () => ({
  useSnackbar: () => ({ showSnackbar: mocks.showSnackbar }),
  useAlertContext: () => ({ setAlertCounts: vi.fn() }),
  usePinsPerMonth: () => ({ setPinsPM: vi.fn() }),
}));
vi.mock('../../components/photos/PhotoField', () => ({
  MIN_PHOTOS: 5,
  default: ({ title, photos, onChange }) => (
    <div>
      <span>{`${title}: ${photos.length}`}</span>
      <button type="button" onClick={() => onChange([...photos, ...Array.from({ length: 5 }, () => new Blob(['x']))])}>add 5</button>
    </div>
  ),
}));
vi.mock('../../components/photos/CameraCapture', () => ({
  default: ({ open, onDone }) => (open ? <button type="button" onClick={() => onDone(Array.from({ length: 5 }, () => new Blob(['x'])))}>done 5</button> : null),
}));

beforeEach(() => {
  Object.values(mocks).forEach((m) => m.mockReset());
  mocks.uploadPinPhotos.mockResolvedValue({ ok: true, uploaded: 5 });
  mocks.updatePin.mockResolvedValue({});
});

const pinBase = { _id: 'p1', equipament: 'E', serie: 'S', cliente: 'C', status: 'Em Reparo', itsNew: 'Não', OBS: '', ctf1: '', ctf2: '', statusNf: '', nf: '', OS: '1' };

const openStatusSelect = (currentLabel) => fireEvent.mouseDown(screen.getByText(currentLabel, { selector: '[role="combobox"]' }));

describe('edit form', () => {
  it('requires 5 exit photos before saving a move to Expedição', async () => {
    const onSubmit = vi.fn();
    renderWithProviders(<PinForm mode="update" initialValues={pinBase} onSubmit={onSubmit} />);
    expect(screen.queryByText(/Fotos de saída/)).toBeNull();
    openStatusSelect('Em Reparo');
    await userEvent.click(within(await screen.findByRole('listbox')).getByText('Expedição'));
    expect(screen.getByText('Fotos de saída: 0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'add 5' }));
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled();
    fireEvent.submit(screen.getByRole('button', { name: 'Salvar' }).closest('form'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [values, extra] = onSubmit.mock.calls[0];
    expect(values.status).toBe('Expedição');
    expect(values.fotos).toBeUndefined();
    expect(extra.fotosSaida).toHaveLength(5);
  });

  it('does not ask for exit photos when the pin is already in Expedição', () => {
    renderWithProviders(<PinForm mode="update" initialValues={{ ...pinBase, status: 'Expedição' }} onSubmit={vi.fn()} />);
    expect(screen.queryByText(/Fotos de saída/)).toBeNull();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled();
  });

  it('does not offer Finalizado for a pin in Em Reparo', async () => {
    renderWithProviders(<PinForm mode="update" initialValues={pinBase} onSubmit={vi.fn()} />);
    openStatusSelect('Em Reparo');
    expect(within(await screen.findByRole('listbox')).queryByText('Finalizado')).toBeNull();
  });

  it('offers Finalizado for a pin in Expedição', async () => {
    renderWithProviders(<PinForm mode="update" initialValues={{ ...pinBase, status: 'Expedição' }} onSubmit={vi.fn()} />);
    openStatusSelect('Expedição');
    expect(within(await screen.findByRole('listbox')).getByText('Finalizado')).toBeInTheDocument();
  });
});

describe('pin page actions', () => {
  const renderActions = (pin, extra = {}) =>
    renderWithProviders(<PinActions pin={pin} onFinalize={vi.fn()} onReset={vi.fn()} onDelete={vi.fn()} onRefresh={vi.fn()} {...extra} />);

  it('offers Finalizar only in Expedição', () => {
    const { unmount } = renderActions(pinBase);
    expect(screen.queryByRole('button', { name: 'Finalizar' })).toBeNull();
    unmount();
    renderActions({ ...pinBase, status: 'Expedição' });
    expect(screen.getByRole('button', { name: 'Finalizar' })).toBeInTheDocument();
  });

  it('warns about pending photos and retakes them', async () => {
    const onRefresh = vi.fn();
    renderActions({ ...pinBase, fotosEntrada: 'pendente' }, { onRefresh });
    expect(screen.getByText('Fotos pendentes')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Tirar fotos agora' }));
    await userEvent.click(screen.getByRole('button', { name: 'done 5' }));
    await waitFor(() => expect(onRefresh).toHaveBeenCalled());
    expect(mocks.uploadPinPhotos.mock.calls[0][0]).toBe('p1');
    expect(mocks.uploadPinPhotos.mock.calls[0][1]).toBe('entrada');
    expect(mocks.uploadPinPhotos.mock.calls[0][2]).toHaveLength(5);
    expect(mocks.showSnackbar).toHaveBeenCalledWith('Fotos enviadas.', 'success');
  });

  it('retakes exit photos when those are the pending ones', async () => {
    renderActions({ ...pinBase, status: 'Expedição', fotosEntrada: 'ok', fotosSaida: 'pendente' });
    expect(screen.getByText('Fotos de saída pendentes')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Tirar fotos agora' }));
    await userEvent.click(screen.getByRole('button', { name: 'done 5' }));
    await waitFor(() => expect(mocks.uploadPinPhotos).toHaveBeenCalled());
    expect(mocks.uploadPinPhotos.mock.calls[0][1]).toBe('saida');
  });

  it('shows nothing for a legacy pin', () => {
    renderActions(pinBase);
    expect(screen.queryByRole('button', { name: 'Tirar fotos agora' })).toBeNull();
    expect(screen.queryByText(/pendentes/)).toBeNull();
  });

  it('links to the SharePoint folder in a new tab', () => {
    renderActions({ ...pinBase, sharepoint: { folderUrl: 'https://mgstec.sharepoint.com/x' } });
    const link = screen.getByRole('link', { name: 'Abrir pasta no SharePoint' });
    expect(link).toHaveAttribute('href', 'https://mgstec.sharepoint.com/x');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

describe('list badge', () => {
  it('card shows the Fotos pendentes chip', () => {
    renderWithProviders(
      <PinCard pin={{ ...pinBase, fotosEntrada: 'pendente' }} statusFilter="Em Aberto" onOpen={vi.fn()} onEdit={vi.fn()} onFinalize={vi.fn()} onReset={vi.fn()} onDelete={vi.fn()} />,
      { width: 375 }
    );
    expect(screen.getByText('Fotos pendentes')).toBeInTheDocument();
  });
});

describe('reset (novo recebimento)', () => {
  it('asks the server for a new passagem', async () => {
    const { result } = renderHook(() => usePins());
    await act(async () => {
      await result.current.resetPinStatus({ ...pinBase, status: 'Finalizado' });
    });
    expect(mocks.updatePin).toHaveBeenCalledWith('p1', expect.objectContaining({ novaPassagem: true, status: 'Recebido' }));
  });
});
