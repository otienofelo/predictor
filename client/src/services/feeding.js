import api from './api';

export const getFeedingLogs = async () => {
  const res = await api.get('/feeding');
  return res.data;
};
export const getDailyFeedingLogs = async () => {
  const res = await api.get('/feeding/daily');
  return res.data;
};
export const getMonthlyCostSummary = async () => {
  const res = await api.get('/feeding/monthly-cost');
  return res.data;
};
export const createFeedingLog = async (data) => {
  const res = await api.post('/feeding', data);
  return res.data;
};
export const updateFeedingLog = async (id, data) => {
  const res = await api.put(`/feeding/${id}`, data);
  return res.data;
};
export const deleteFeedingLog = async (id) => {
  const res = await api.delete(`/feeding/${id}`);
  return res.data;
};