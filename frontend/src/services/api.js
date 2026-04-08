import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change when backend is ready
  headers: { 'Content-Type': 'application/json' }
});

// Add token to every request (future auth)
api.interceptors.request.use(config => config);

export default api;