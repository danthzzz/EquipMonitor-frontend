import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/renderWithProviders';
import Customers from '../customers/Customers';
import Equips from '../equips/Equips';

vi.mock('../../hooks/useCustomers', () => ({
  useCustomers: () => ({ customers: [{ _id: 'c1', empresa: 'ACME', cnpj: '12.345.678/0001-90' }], loading: false, deleteCustomer: vi.fn() }),
}));
vi.mock('../../hooks/useEquips', () => ({
  useEquips: () => ({ staticDevices: [{ modelo: 'VIBXPERT II', codigo: 'VIB53101E', tipo: 'CM' }] }),
}));
vi.mock('../../context', () => ({ useSnackbar: () => ({ showSnackbar: vi.fn() }) }));
vi.mock('../../components/sidebar/Sidebar', () => ({ default: () => null }));

describe('Customers', () => {
  it('phone: shows customer cards and the add fab, no table', () => {
    renderWithProviders(<Customers />, { width: 375 });
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.getByText('ACME')).toBeInTheDocument();
    expect(screen.getByText('CNPJ: 12.345.678/0001-90')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /adicionar/i })).toHaveAttribute('href', '/createcustomer');
  });

  it('phone: Excluir from the card menu opens the confirmation dialog', async () => {
    renderWithProviders(<Customers />, { width: 375 });
    await userEvent.click(screen.getByRole('button', { name: 'Ações' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Excluir' }));
    expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
  });

  it('desktop: keeps the table and the header button only', () => {
    renderWithProviders(<Customers />, { width: 1280 });
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /adicionar/i })).toHaveLength(1);
  });
});

describe('Equips', () => {
  it('phone: shows equip cards and the fab opens the form', async () => {
    renderWithProviders(<Equips />, { width: 375 });
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.getByText('Código: VIB53101E')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /adicionar/i }));
    expect(screen.getByText('Novo Equipamento')).toBeInTheDocument();
  });

  it('desktop: keeps the table', () => {
    renderWithProviders(<Equips />, { width: 1280 });
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
