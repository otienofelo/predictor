import api from './api';

// Get all diseases
export const getDiseases = async () => {
  const response = await api.get('/diseases');
  return response.data;
};

// Get single disease
export const getDiseaseById = async (id) => {
  const response = await api.get(`/diseases/${id}`);
  return response.data;
};

// Create disease
export const createDisease = async (diseaseData) => {
  const response = await api.post('/diseases', diseaseData);
  return response.data;
};

// Update disease
export const updateDisease = async (id, diseaseData) => {
  const response = await api.put(`/diseases/${id}`, diseaseData);
  return response.data;
};

// Delete disease
export const deleteDisease = async (id) => {
  const response = await api.delete(`/diseases/${id}`);
  return response.data;
};