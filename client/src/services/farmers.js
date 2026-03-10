import api from './api';

// Fetch all farmers
export const getFarmers = async () => {
  const response = await api.get('/farmers');
  return response.data;
};

// Fetch a single farmer
export const getFarmerById = async (id) => {
  const response = await api.get(`/farmers/${id}`);
  return response.data;
};

// Create a farmer
export const createFarmer = async (farmerData) => {
  const response = await api.post('/farmers', farmerData);
  return response.data;
};

// Update a farmer
export const updateFarmer = async (id, farmerData) => {
  const response = await api.put(`/farmers/${id}`, farmerData);
  return response.data;
};

// Delete a farmer
export const deleteFarmer = async (id) => {
  const response = await api.delete(`/farmers/${id}`);
  return response.data;
};