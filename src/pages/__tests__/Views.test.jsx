import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../test/renderWithProviders';
import SinglePin from '../pins/SinglePin';
import Dashboard from '../Dashboard';

vi.mock('../../hooks/usePins', () => ({
  usePins: () => ({
    pins: [{ _id: 'p1', equipament: 'VIBXPERT II', serie: 'S1', cliente: 'ACME', status: 'Expedição', updatedAt: new Date().toISOString() }],
    loading: false,
    deletePin: vi.fn(),
    resetPinStatus: vi.fn(),
    updateStatusDirect: vi.fn(),
  }),
}));
vi.mock('../../hooks/useDashboard', () => ({
  useDashboard: () => ({ loading: false, availableYears: [2026], selectedYear: 2026, setSelectedYear: vi.fn(), chartData: [], barData: [], totalPins: 0 }),
}));
vi.mock('../../context', () => ({ useSnackbar: () => ({ showSnackbar: vi.fn() }) }));
vi.mock('../../components/sidebar/Sidebar', () => ({ default: () => null }));
vi.mock('../../components/dashboard/DashboardPieChart', () => ({ default: () => null }));
vi.mock('../../components/dashboard/DashboardBarChart', () => ({ default: () => null }));

beforeEach(() => {
  localStorage.setItem('userData', JSON.stringify({ name: 'Daniel' }));
});

describe('SinglePin', () => {
  it('phone: action buttons are full width', () => {
    renderWithProviders(
      <Routes><Route path="/pin/:id" element={<SinglePin />} /></Routes>,
      { width: 375, route: '/pin/p1' }
    );
    for (const name of ['Editar', 'Finalizar', 'Excluir']) {
      expect(screen.getByRole('button', { name })).toHaveClass('MuiButton-fullWidth');
    }
  });

  it('desktop: action buttons keep their natural width', () => {
    renderWithProviders(
      <Routes><Route path="/pin/:id" element={<SinglePin />} /></Routes>,
      { width: 1280, route: '/pin/p1' }
    );
    expect(screen.getByRole('button', { name: 'Editar' })).not.toHaveClass('MuiButton-fullWidth');
  });
});

describe('Dashboard', () => {
  it('phone: year select spans the full width under the title', () => {
    renderWithProviders(<Dashboard />, { width: 375 });
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('combobox').closest('.MuiFormControl-root')).toHaveClass('MuiFormControl-fullWidth');
  });

  it('desktop: year select keeps its compact width', () => {
    renderWithProviders(<Dashboard />, { width: 1280 });
    expect(screen.getByRole('combobox').closest('.MuiFormControl-root')).not.toHaveClass('MuiFormControl-fullWidth');
  });
});
