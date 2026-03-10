import api from './api';

export const getVaccinations = async () => {
  const res = await api.get('/vaccinations');
  return res.data;
};
export const getUpcomingVaccinations = async () => {
  const res = await api.get('/vaccinations/upcoming');
  return res.data;
};
export const getVaccinationsByAnimal = async (animalId) => {
  const res = await api.get(`/vaccinations/animal/${animalId}`);
  return res.data;
};
export const createVaccination = async (data) => {
  const res = await api.post('/vaccinations', data);
  return res.data;
};
export const updateVaccination = async (id, data) => {
  const res = await api.put(`/vaccinations/${id}`, data);
  return res.data;
};
export const deleteVaccination = async (id) => {
  const res = await api.delete(`/vaccinations/${id}`);
  return res.data;
};