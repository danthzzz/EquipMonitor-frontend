import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/renderWithProviders';
import ResponsiveDialog from '../ResponsiveDialog';
import FormActions from '../FormActions';
import CustomerForm from '../../customers/CustomerForm';
import PinClienteNfFields from '../../pins/PinClienteNfFields';
import ContactFormDialog from '../../customers/ContactFormDialog';

describe('ResponsiveDialog', () => {
  it('is full screen on phones', () => {
    renderWithProviders(<ResponsiveDialog open>conteúdo</ResponsiveDialog>, { width: 375 });
    expect(document.querySelector('.MuiDialog-paperFullScreen')).not.toBeNull();
  });
  it('is a normal dialog on desktop', () => {
    renderWithProviders(<ResponsiveDialog open>conteúdo</ResponsiveDialog>, { width: 1280 });
    expect(document.querySelector('.MuiDialog-paperFullScreen')).toBeNull();
  });
  it('is used by the contact form dialog', () => {
    renderWithProviders(<ContactFormDialog open initialValues={null} onClose={vi.fn()} onSubmit={vi.fn()} />, { width: 375 });
    expect(document.querySelector('.MuiDialog-paperFullScreen')).not.toBeNull();
  });
});

describe('FormActions', () => {
  it('sticks to the bottom on phones', () => {
    renderWithProviders(<FormActions><button>Salvar</button></FormActions>, { width: 375 });
    expect(screen.getByTestId('form-actions')).toHaveStyle({ position: 'sticky' });
  });
  it('is a plain right-aligned row on desktop', () => {
    renderWithProviders(<FormActions><button>Salvar</button></FormActions>, { width: 1280 });
    expect(screen.getByTestId('form-actions')).not.toHaveStyle({ position: 'sticky' });
  });
  it('wraps the CustomerForm submit button', () => {
    renderWithProviders(<CustomerForm onSubmit={vi.fn()} />, { width: 375 });
    expect(screen.getByRole('button', { name: 'Salvar' }).closest('[data-testid="form-actions"]')).not.toBeNull();
  });
});

describe('PinClienteNfFields', () => {
  it('opens the numeric keyboard for OS and NF', () => {
    renderWithProviders(
      <PinClienteNfFields
        values={{ OS: '', nf: '', statusNf: '', entryDate: '2026-10-19' }}
        onValuesChange={vi.fn()}
        customers={[]}
        selectedCustomer={null}
        onCustomerChange={vi.fn()}
      />,
      { width: 375 }
    );
    expect(screen.getByLabelText('Ordem de Serviço')).toHaveAttribute('inputmode', 'numeric');
    expect(screen.getByLabelText('Nota Fiscal')).toHaveAttribute('inputmode', 'numeric');
  });
});
