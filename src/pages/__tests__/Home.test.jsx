import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/renderWithProviders';
import Home from '../Home';

const pins = [
  { _id: '1', equipament: 'VIBXPERT II', serie: 'S1', cliente: 'ACME', status: 'Em Reparo', updatedAt: new Date().toISOString() },
  { _id: '2', equipament: 'OPTALIGN smart', serie: 'S2', cliente: 'Beta', status: 'Recebido', updatedAt: new Date().toISOString() },
];

vi.mock('../../hooks/usePins', () => ({
  usePins: () => ({ pins, loading: false, deletePin: vi.fn(), resetPinStatus: vi.fn(), updateStatusDirect: vi.fn() }),
}));
vi.mock('../../hooks/useEquips', () => ({ useEquips: () => ({ equips: [] }) }));
vi.mock('../../context', () => ({ useSnackbar: () => ({ showSnackbar: vi.fn() }) }));
vi.mock('../../components/sidebar/Sidebar', () => ({ default: () => null }));

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('userData', JSON.stringify({ name: 'Daniel' }));
});

describe('Home', () => {
  it('phone: shows cards and the Adicionar fab, no table', () => {
    renderWithProviders(<Home />, { width: 375 });
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.getByText('VIBXPERT II')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /adicionar/i })).toHaveAttribute('href', '/create');
  });

  it('phone: Em Aberto / Finalizado are tabs', () => {
    renderWithProviders(<Home />, { width: 375 });
    expect(screen.getByRole('tab', { name: /em aberto/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /finalizado/i })).toBeInTheDocument();
  });

  it('desktop: keeps the table', () => {
    renderWithProviders(<Home />, { width: 1280 });
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByRole('tab')).toBeNull();
  });

  it('phone: text search filters cards by the chosen field', async () => {
    localStorage.setItem('searchField', JSON.stringify('cliente'));
    renderWithProviders(<Home />, { width: 375 });
    await userEvent.type(screen.getByPlaceholderText('Pesquisar por Cliente…'), 'beta');
    expect(screen.queryByText('VIBXPERT II')).toBeNull();
    expect(screen.getByText('OPTALIGN smart')).toBeInTheDocument();
  });

  it('phone: Status mode with Todos shows no search box and no chip', () => {
    localStorage.setItem('searchField', JSON.stringify('status'));
    renderWithProviders(<Home />, { width: 375 });
    expect(screen.queryByPlaceholderText(/pesquisar/i)).toBeNull();
    expect(screen.queryByText(/^Status:/)).toBeNull();
    expect(screen.getByRole('button', { name: /filtros/i })).toBeInTheDocument();
  });

  it('phone: active Status filter shows a chip', () => {
    localStorage.setItem('searchField', JSON.stringify('status'));
    localStorage.setItem('status', JSON.stringify('Em Reparo'));
    renderWithProviders(<Home />, { width: 375 });
    expect(screen.getByText('Status: Em Reparo')).toBeInTheDocument();
    expect(screen.queryByText('OPTALIGN smart')).toBeNull();
  });

  it('phone: Limpar clears values but keeps Buscar por', async () => {
    localStorage.setItem('searchField', JSON.stringify('status'));
    localStorage.setItem('status', JSON.stringify('Em Reparo'));
    renderWithProviders(<Home />, { width: 375 });
    await userEvent.click(screen.getByRole('button', { name: /filtros/i }));
    const sheet = screen.getByRole('presentation');
    await userEvent.click(within(sheet).getByRole('button', { name: 'Limpar' }));
    expect(screen.queryByText('Status: Em Reparo')).toBeNull();
    expect(screen.getByText('OPTALIGN smart')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('searchField'))).toBe('status');
  });
});

describe('Home filter chip', () => {
  it('phone: a long active filter chip can shrink instead of widening the row', () => {
    localStorage.setItem('searchField', JSON.stringify('status'));
    localStorage.setItem('status', JSON.stringify('Recusado na Calibração'));
    renderWithProviders(<Home />, { width: 360 });
    const chip = screen.getByText('Status: Recusado na Calibração').closest('.MuiChip-root');
    // jsdom reports the unitless value
    expect(getComputedStyle(chip).minWidth).toBe('0');
  });
});
