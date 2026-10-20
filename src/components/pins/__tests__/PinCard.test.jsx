import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/renderWithProviders';
import PinCard from '../PinCard';

const handlers = () => ({
  onOpen: vi.fn(),
  onEdit: vi.fn(),
  onFinalize: vi.fn(),
  onReset: vi.fn(),
  onDelete: vi.fn(),
});

const basePin = { _id: '1', equipament: 'VIBXPERT II', serie: 'S1', cliente: 'ACME', status: 'Recebido' };

describe('PinCard', () => {
  it('shows dashes for missing optional fields', () => {
    renderWithProviders(<PinCard pin={basePin} statusFilter="Em Aberto" {...handlers()} />, { width: 375 });
    expect(screen.getByText('OS — · NF — · —')).toBeInTheDocument();
    expect(screen.queryByText(/undefined|Invalid Date/)).toBeNull();
  });

  it('shows dash for an unparseable entry date instead of crashing', () => {
    renderWithProviders(<PinCard pin={{ ...basePin, OS: '12', nf: '34', entryDate: 'lixo' }} statusFilter="Em Aberto" {...handlers()} />, { width: 375 });
    expect(screen.getByText('OS 12 · NF 34 · —')).toBeInTheDocument();
  });

  it('shows equipment, device code, client and serial', () => {
    renderWithProviders(<PinCard pin={basePin} statusFilter="Em Aberto" {...handlers()} />, { width: 375 });
    expect(screen.getByText('VIBXPERT II')).toBeInTheDocument();
    expect(screen.getByText('VIB53101E')).toBeInTheDocument();
    expect(screen.getByText('ACME · S/N S1')).toBeInTheDocument();
  });

  it('opens the pin when the card is tapped', async () => {
    const h = handlers();
    renderWithProviders(<PinCard pin={basePin} statusFilter="Em Aberto" {...h} />, { width: 375 });
    await userEvent.click(screen.getByText('VIBXPERT II'));
    expect(h.onOpen).toHaveBeenCalledWith('1');
  });

  it('runs a menu action without opening the pin', async () => {
    const h = handlers();
    renderWithProviders(<PinCard pin={basePin} statusFilter="Em Aberto" {...h} />, { width: 375 });
    await userEvent.click(screen.getByRole('button', { name: 'Ações' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Excluir' }));
    expect(h.onDelete).toHaveBeenCalledWith(basePin);
    expect(h.onOpen).not.toHaveBeenCalled();
  });

  it('lists Finalizar for pins in Expedição and finalizes with Finalizado', async () => {
    const h = handlers();
    const pin = { ...basePin, status: 'Expedição' };
    renderWithProviders(<PinCard pin={pin} statusFilter="Em Aberto" {...h} />, { width: 375 });
    await userEvent.click(screen.getByRole('button', { name: 'Ações' }));
    expect(screen.queryByRole('menuitem', { name: 'Resetar' })).toBeNull();
    await userEvent.click(screen.getByRole('menuitem', { name: 'Finalizar' }));
    expect(h.onFinalize).toHaveBeenCalledWith(pin, 'Finalizado');
  });

  it('does not offer Finalizar before Expedição', async () => {
    renderWithProviders(<PinCard pin={basePin} statusFilter="Em Aberto" {...handlers()} />, { width: 375 });
    await userEvent.click(screen.getByRole('button', { name: 'Ações' }));
    expect(screen.queryByRole('menuitem', { name: 'Finalizar' })).toBeNull();
  });

  it('lists Resetar for finished pins', async () => {
    const pin = { ...basePin, status: 'Finalizado' };
    renderWithProviders(<PinCard pin={pin} statusFilter="Finalizado" {...handlers()} />, { width: 375 });
    await userEvent.click(screen.getByRole('button', { name: 'Ações' }));
    expect(screen.getByRole('menuitem', { name: 'Resetar' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Finalizar' })).toBeNull();
  });
});
