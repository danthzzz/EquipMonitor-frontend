import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-iota-five-80.vercel.app',
  withCredentials: true
});

export default api;