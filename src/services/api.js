import axios from 'axios';

const api = axios.create({
  baseURL: 'https://danthzzz-embackend.vercel.app',
  withCredentials: true
});

export default api;