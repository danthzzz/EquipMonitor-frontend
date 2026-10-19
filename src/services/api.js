import axios from 'axios';

const api = axios.create({
  baseURL: 'https://danthzzz-embackend.vercel.app',
  withCredentials: true
});

// The login response (including the JWT) is stored as localStorage.userData.
export function getStoredToken() {
  try {
    return JSON.parse(localStorage.getItem('userData'))?.token || null;
  } catch {
    return null;
  }
}

export function attachToken(config) {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

// Missing or expired session: drop it and go back to the login page.
export function handleUnauthorized(error, redirect = (path) => window.location.assign(path)) {
  const isLoginRequest = error.config?.url === '/users/login';
  if (error.response?.status === 401 && !isLoginRequest) {
    localStorage.removeItem('userData');
    if (window.location.pathname !== '/') {
      redirect('/');
    }
  }
  return Promise.reject(error);
}

api.interceptors.request.use(attachToken);
api.interceptors.response.use((response) => response, (error) => handleUnauthorized(error));

export default api;
