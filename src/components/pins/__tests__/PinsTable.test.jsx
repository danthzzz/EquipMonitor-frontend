import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/renderWithProviders';
import PinsTable from '../PinsTable';

const pin = { _id: '1', equipament: 'VIBXPERT II', serie: 'S1', cliente: 'ACME', status: 'Expedição' };

describe('PinsTable (desktop) after refactor', () => {
  it('keeps the device code column and the open-pin actions', async () => {
    const onFinalize = vi.fn();
    renderWithProviders(
      <PinsTable pins={[pin]} loading={false} statusFilter="Em Aberto" onRowClick={vi.fn()} onDelete={vi.fn()} onReset={vi.fn()} onFinalize={onFinalize} />
    );
    expect(screen.getByText('VIB53101E')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Resetar' })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Finalizar' }));
    expect(onFinalize).toHaveBeenCalledWith(pin, 'Finalizado');
  });
});
