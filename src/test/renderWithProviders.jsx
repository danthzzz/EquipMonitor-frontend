import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import mediaQuery from 'css-mediaquery';
import getAppTheme from '../theme';

export function setViewportWidth(width) {
  window.matchMedia = (query) => ({
    matches: mediaQuery.match(query, { type: 'screen', width }),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

export function renderWithProviders(ui, { width = 1280, route = '/' } = {}) {
  setViewportWidth(width);
  return render(
    <ThemeProvider theme={getAppTheme('light')}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </ThemeProvider>
  );
}
