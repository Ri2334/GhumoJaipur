import apiClient from './api';

export const createBookingApi = async (payload) => {
  const response = await apiClient.post('/bookings/create', payload);
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
