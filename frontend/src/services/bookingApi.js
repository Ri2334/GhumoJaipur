import apiClient from './api';

export const createBookingApi = async (payload) => {
  const response = await apiClient.post('/bookings', payload);
  // Backend returns { success: true, data: {...} }, so we pass that directly
  return response.data;
};

export const confirmBookingApi = async (id) => {
  const response = await apiClient.post(`/bookings/${id}/confirm`);
  return response.data;
};

export const getBookingApi = async (id) => {
  const response = await apiClient.get(`/bookings/${id}`);
  return response.data;
};

export const getMyBookingsApi = async () => {
  const response = await apiClient.get('/bookings/my');
  return response.data;
};

export const cancelBookingApi = async (id) => {
  const response = await apiClient.post(`/bookings/${id}/cancel`);
  return response.data;
};

export const rateDriverApi = async (id, rating) => {
  const response = await apiClient.post(`/bookings/${id}/rate-driver`, { rating });
  return response.data;
};
