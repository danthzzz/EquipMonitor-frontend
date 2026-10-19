import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/renderWithProviders';
import PageHeader from '../PageHeader';
import { getMainPadding } from '../../../layouts/MainLayout';

describe('MainLayout bottom space', () => {
  it('keeps the Fab clearance on portrait tablets (sm) as well as phones', () => {
    const { pb } = getMainPadding(true);
    expect(pb.xs).toBe(11);
    expect(pb.sm).toBe(11);
    expect(pb.md).toBe(3);
  });

  it('uses the normal bottom padding without bottomSpace', () => {
    expect(getMainPadding(false).pb).toEqual({ xs: 1.5, sm: 2, md: 3 });
  });
});

describe('PageHeader title size', () => {
  it('shrinks the title on phones', () => {
    renderWithProviders(<PageHeader title="Clientes" />, { width: 375 });
    expect(screen.getByRole('heading', { name: 'Clientes' })).toHaveStyle({ fontSize: '1.15rem' });
  });

  it('keeps the theme h5 size on desktop', () => {
    renderWithProviders(<PageHeader title="Clientes" />, { width: 1280 });
    const heading = screen.getByRole('heading', { name: 'Clientes' });
    expect(heading).not.toHaveStyle({ fontSize: '1.15rem' });
    expect(heading).not.toHaveStyle({ fontSize: '1.5rem' });
  });
});
