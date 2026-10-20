import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/renderWithProviders';
import CreatePin from '../pins/CreatePin';
import PinEquipamentoFields from '../../components/pins/PinEquipamentoFields';

const mocks = vi.hoisted(() => ({
  createPin: vi.fn(),
  uploadPinPhotos: vi.fn(),
  showSnackbar: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock('../../hooks/usePins', () => ({ usePins: () => ({ pins: [{ OS: '10' }], createPin: mocks.createPin }) }));
vi.mock('../../hooks/useEquips', () => ({ useEquips: () => ({ equipOptions: [] }) }));
vi.mock('../../hooks/useCustomers', () => ({ useCustomers: () => ({ customers: [] }) }));
vi.mock('../../hooks/useDevices', () => ({ useDevices: () => ({ devices: [], createDevice: vi.fn() }) }));
vi.mock('../../context', () => ({ useSnackbar: () => ({ showSnackbar: mocks.showSnackbar }) }));
vi.mock('../../components/sidebar/Sidebar', () => ({ default: () => null }));
vi.mock('../../services/photoService', () => ({ uploadPinPhotos: mocks.uploadPinPhotos }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig()), useNavigate: () => mocks.navigate }));
// Stand-in for the camera: one click adds five photos.
vi.mock('../../components/photos/PhotoField', () => ({
  MIN_PHOTOS: 5,
  default: ({ title, photos, onChange }) => (
    <div>
      <span>{`${title}: ${photos.length}`}</span>
      <button type="button" onClick={() => onChange([...photos, ...Array.from({ length: 5 }, () => new Blob(['x']))])}>
        add 5
      </button>
    </div>
  ),
}));

beforeEach(() => {
  Object.values(mocks).forEach((m) => m.mockReset());
  let n = 0;
  mocks.createPin.mockImplementation(async (data) => ({ _id: `p${++n}`, ...data }));
  mocks.uploadPinPhotos.mockResolvedValue({ ok: true, uploaded: 5 });
});

const submit = () => fireEvent.submit(screen.getByRole('button', { name: 'Cadastrar' }).closest('form'));

describe('CreatePin', () => {
  it('keeps Cadastrar disabled until every equipment has 5 photos', async () => {
    renderWithProviders(<CreatePin />, { width: 375 });
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeDisabled();
    expect(screen.getByText('Tire pelo menos 5 fotos de cada equipamento')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar outro equipamento' }));
    const [first, second] = screen.getAllByRole('button', { name: 'add 5' });
    await userEvent.click(first);
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeDisabled();
    await userEvent.click(second);
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeEnabled();
  });

  it('uploads each created pin\'s photos after creating it, without sending the photos to /pins', async () => {
    renderWithProviders(<CreatePin />, { width: 375 });
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar outro equipamento' }));
    for (const button of screen.getAllByRole('button', { name: 'add 5' })) await userEvent.click(button);
    submit();
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith('/home'));
    expect(mocks.createPin).toHaveBeenCalledTimes(2);
    expect(mocks.createPin.mock.calls[0][0].fotos).toBeUndefined();
    expect(mocks.uploadPinPhotos.mock.calls.map((c) => [c[0], c[1], c[2].length])).toEqual([
      ['p1', 'entrada', 5],
      ['p2', 'entrada', 5],
    ]);
    expect(mocks.showSnackbar).toHaveBeenLastCalledWith('2 equipamentos cadastrados com sucesso.', 'success');
  });

  it('still navigates and warns when an upload fails', async () => {
    mocks.uploadPinPhotos.mockResolvedValue({ ok: false, uploaded: 2 });
    renderWithProviders(<CreatePin />, { width: 375 });
    await userEvent.click(screen.getByRole('button', { name: 'add 5' }));
    submit();
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith('/home'));
    expect(mocks.showSnackbar).toHaveBeenLastCalledWith(
      '1 equipamento(s) cadastrado(s), mas as fotos ficaram pendentes. Tire as fotos novamente quando a conexão voltar.',
      'warning'
    );
  });
});

describe('PinEquipamentoFields in create mode', () => {
  it('does not offer Expedição', async () => {
    renderWithProviders(
      <PinEquipamentoFields
        values={{ deviceId: '', equipament: '', serie: '', status: 'Recebido', itsNew: 'Não', ctf1: '', ctf2: '', OBS: '', fotos: [] }}
        onValuesChange={vi.fn()}
        devices={[]}
        createDevice={vi.fn()}
        customerId="c1"
        equipOptions={[]}
        mode="create"
      />
    );
    fireEvent.mouseDown(screen.getByText('Recebido'));
    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).queryByText('Expedição')).toBeNull();
    expect(within(listbox).getByText('Em Reparo')).toBeInTheDocument();
  });
});
