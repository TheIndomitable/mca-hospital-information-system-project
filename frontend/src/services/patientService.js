import api from './api';

export const patientService = {
  register: (data) => api.post('/patients/register', data),
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  // Add more as needed
};