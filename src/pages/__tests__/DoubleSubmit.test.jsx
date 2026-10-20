import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../test/renderWithProviders';
import UpdatePin from '../pins/UpdatePin';
import CreatePin from '../pins/CreatePin';

const mocks = vi.hoisted(() => ({
  updatePin: vi.fn(),
  createPin: vi.fn(),
  uploadPinPhotos: vi.fn(),
  showSnackbar: vi.fn(),
  navigate: vi.fn(),
}));

const pin = { _id: 'p1', equipament: 'E', serie: 'S', cliente: 'C', status: 'Em Reparo', itsNew: 'Não', OBS: '', ctf1: '', ctf2: '', statusNf: '', nf: '', OS: '1' };

vi.mock('../../hooks/usePins', () => ({
  usePins: () => ({ pins: [pin], loading: false, updatePin: mocks.updatePin, createPin: mocks.createPin }),
}));
vi.mock('../../hooks/useEquips', () => ({ useEquips: () => ({ equipOptions: [] }) }));
vi.mock('../../hooks/useCustomers', () => ({ useCustomers: () => ({ customers: [] }) }));
vi.mock('../../hooks/useDevices', () => ({ useDevices: () => ({ devices: [], createDevice: vi.fn() }) }));
vi.mock('../../context', () => ({ useSnackbar: () => ({ showSnackbar: mocks.showSnackbar }) }));
vi.mock('../../components/sidebar/Sidebar', () => ({ default: () => null }));
vi.mock('../../services/photoService', () => ({ uploadPinPhotos: mocks.uploadPinPhotos }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig()), useNavigate: () => mocks.navigate }));
vi.mock('../../components/photos/PhotoField', () => ({
  MIN_PHOTOS: 5,
  default: ({ photos, onChange }) => (
    <button type="button" onClick={() => onChange([...photos, ...Array.from({ length: 5 }, () => new Blob(['x']))])}>add 5</button>
  ),
}));

// A save that stays pending until the test resolves it.
const deferred = () => {
  let resolve;
  const promise = new Promise((r) => { resolve = r; });
  return { promise, resolve };
};

beforeEach(() => {
  Object.values(mocks).forEach((m) => m.mockReset());
  mocks.uploadPinPhotos.mockResolvedValue({ ok: true, uploaded: 5 });
});

describe('UpdatePin', () => {
  it('saves once even if Salvar is triggered twice, and disables it while saving', async () => {
    const save = deferred();
    mocks.updatePin.mockReturnValue(save.promise);
    renderWithProviders(<Routes><Route path="/update/:id" element={<UpdatePin />} /></Routes>, { route: '/update/p1' });
    const form = screen.getByRole('button', { name: 'Salvar' }).closest('form');
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(mocks.updatePin).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled());
    save.resolve({});
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith('/pin/p1'));
  });
});

describe('CreatePin', () => {
  it('creates once even if Cadastrar is triggered twice', async () => {
    const create = deferred();
    mocks.createPin.mockReturnValue(create.promise);
    renderWithProviders(<CreatePin />);
    fireEvent.click(screen.getByRole('button', { name: 'add 5' }));
    const form = screen.getByRole('button', { name: 'Cadastrar' }).closest('form');
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(mocks.createPin).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeDisabled());
    create.resolve({ _id: 'n1' });
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith('/home'));
  });
});
