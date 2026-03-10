import api from './api';

// Fetch all animals
export const getAnimals = async () => {
  const response = await api.get('/animals');
  return response.data;
};

// Fetch a single animal
export const getAnimalById = async (id) => {
  const response = await api.get(`/animals/${id}`);
  return response.data;
};

// Create an animal
export const createAnimal = async (animalData) => {
  const response = await api.post('/animals', animalData);
  return response.data;
};

// Update an animal
export const updateAnimal = async (id, animalData) => {
  const response = await api.put(`/animals/${id}`, animalData);
  return response.data;
};

// Delete an animal
export const deleteAnimal = async (id) => {
  const response = await api.delete(`/animals/${id}`);
  return response.data;
};