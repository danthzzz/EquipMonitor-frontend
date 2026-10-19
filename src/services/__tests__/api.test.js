import { attachToken, getStoredToken, handleUnauthorized } from '../api';

const unauthorized = (url) => ({ response: { status: 401 }, config: { url } });

beforeEach(() => {
  localStorage.clear();
});

describe('getStoredToken', () => {
  it('reads the token from userData', () => {
    localStorage.setItem('userData', JSON.stringify({ name: 'Ana', token: 't1' }));
    expect(getStoredToken()).toBe('t1');
  });

  it('is null for corrupt userData', () => {
    localStorage.setItem('userData', '{não é json');
    expect(getStoredToken()).toBeNull();
  });
});

describe('attachToken', () => {
  it('adds the bearer header from userData', () => {
    localStorage.setItem('userData', JSON.stringify({ name: 'Ana', token: 't1' }));
    const config = attachToken({ headers: {} });
    expect(config.headers.Authorization).toBe('Bearer t1');
  });

  it('leaves headers alone for a session from before the token existed', () => {
    localStorage.setItem('userData', JSON.stringify({ name: 'Ana' }));
    const config = attachToken({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();
  });
});

describe('handleUnauthorized', () => {
  it('clears the session and redirects to login on 401', async () => {
    window.history.pushState({}, '', '/home');
    localStorage.setItem('userData', JSON.stringify({ name: 'Ana', token: 'expirado' }));
    const redirect = vi.fn();
    const error = unauthorized('/pins');
    await expect(handleUnauthorized(error, redirect)).rejects.toBe(error);
    expect(localStorage.getItem('userData')).toBeNull();
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('does not redirect again when already on the login page', async () => {
    window.history.pushState({}, '', '/');
    const redirect = vi.fn();
    await expect(handleUnauthorized(unauthorized('/pins'), redirect)).rejects.toBeDefined();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('ignores a 401 from the login request', async () => {
    localStorage.setItem('userData', JSON.stringify({ name: 'Ana' }));
    const redirect = vi.fn();
    await expect(handleUnauthorized(unauthorized('/users/login'), redirect)).rejects.toBeDefined();
    expect(redirect).not.toHaveBeenCalled();
    expect(localStorage.getItem('userData')).not.toBeNull();
  });

  it('does nothing special for other errors', async () => {
    const redirect = vi.fn();
    const error = { response: { status: 500 }, config: { url: '/pins' } };
    await expect(handleUnauthorized(error, redirect)).rejects.toBe(error);
    expect(redirect).not.toHaveBeenCalled();
  });

  it('handles network errors without a response', async () => {
    const redirect = vi.fn();
    const error = { message: 'Network Error', config: { url: '/pins' } };
    await expect(handleUnauthorized(error, redirect)).rejects.toBe(error);
    expect(redirect).not.toHaveBeenCalled();
  });
});
