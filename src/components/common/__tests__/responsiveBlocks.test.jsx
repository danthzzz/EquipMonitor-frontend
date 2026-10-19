import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/renderWithProviders';
import AddFab from '../AddFab';
import PageHeader from '../PageHeader';

describe('AddFab', () => {
  it('renders a link on phone width', () => {
    renderWithProviders(<AddFab to="/create" />, { width: 375 });
    expect(screen.getByRole('link', { name: /adicionar/i })).toHaveAttribute('href', '/create');
  });

  it('renders nothing on desktop width', () => {
    renderWithProviders(<AddFab to="/create" />, { width: 1280 });
    expect(screen.queryByRole('link', { name: /adicionar/i })).toBeNull();
  });

  it('calls onClick when used as a button', async () => {
    const onClick = vi.fn();
    renderWithProviders(<AddFab onClick={onClick} />, { width: 375 });
    await userEvent.click(screen.getByRole('button', { name: /adicionar/i }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe('PageHeader', () => {
  it('shows the title and a back button that calls onBack', async () => {
    const onBack = vi.fn();
    renderWithProviders(<PageHeader title="Novo Cliente" onBack={onBack} />);
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(onBack).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Novo Cliente' })).toBeInTheDocument();
  });

  it('omits the back button without onBack', () => {
    renderWithProviders(<PageHeader title="Clientes" />);
    expect(screen.queryByRole('button', { name: 'Voltar' })).toBeNull();
  });
});
