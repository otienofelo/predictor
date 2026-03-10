import api from './api';

// Fetch all visits
export const getVisits = async () => {
  const response = await api.get('/visits');
  return response.data;
};

// Fetch a single visit
export const getVisitById = async (id) => {
  const response = await api.get(`/visits/${id}`);
  return response.data;
};

// Create a visit
export const createVisit = async (visitData) => {
  const response = await api.post('/visits', visitData);
  return response.data;
};

// Update a visit
export const updateVisit = async (id, visitData) => {
  const response = await api.put(`/visits/${id}`, visitData);
  return response.data;
};

// Delete a visit
export const deleteVisit = async (id) => {
  const response = await api.delete(`/visits/${id}`);
  return response.data;
};