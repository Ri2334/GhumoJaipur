import axios from "axios";

// Create axios instance with base URL from environment
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout for cold starts on Render
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ghumo_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Test API functions
export const getTestData = async () => {
  try {
    const response = await apiClient.get("/test");
    return response.data;
  } catch (error) {
    console.error("Error fetching test data:", error);
    throw error;
  }
};

export const postTestData = async (name) => {
  try {
    const response = await apiClient.post("/test", { name });
    return response.data;
  } catch (error) {
    console.error("Error posting test data:", error);
    throw error;
  }
};

export const sendOtpApi = async (email, purpose = "signup") => {
  const response = await apiClient.post("/auth/send-otp", { email, purpose });
  return response.data;
};

export const verifyOtpApi = async (email, otp, purpose = "signup") => {
  const response = await apiClient.post("/auth/verify-otp", { email, otp, purpose });
  return response.data;
};

export const signupApi = async (payload) => {
  const response = await apiClient.post("/auth/signup", payload);
  return response.data;
};

export const loginApi = async (payload) => {
  const response = await apiClient.post("/auth/login", payload);
  return response.data;
};

export const forgotPasswordApi = async (email) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPasswordApi = async (payload) => {
  const response = await apiClient.post("/auth/reset-password", payload);
  return response.data;
};

export const getPlacesApi = async (params = {}) => {
  const response = await apiClient.get("/places", { params });
  return response.data;
};

export const getPlaceByIdApi = async (id) => {
  const response = await apiClient.get(`/places/${id}`);
  return response.data;
};

export const createPlaceApi = async (payload) => {
  const response = await apiClient.post("/places", payload);
  return response.data;
};

export const updatePlaceApi = async (id, payload) => {
  const response = await apiClient.put(`/places/${id}`, payload);
  return response.data;
};

export const deletePlaceApi = async (id) => {
  const response = await apiClient.delete(`/places/${id}`);
  return response.data;
};

export const addPlaceReviewApi = async (id, payload) => {
  const response = await apiClient.post(`/places/${id}/reviews`, payload);
  return response.data;
};

export const getSavedTripsApi = async () => {
  const response = await apiClient.get("/saved-trips");
  return response.data;
};

export const saveTripApi = async (placeId) => {
  const response = await apiClient.post("/saved-trips", { placeId });
  return response.data;
};

export const deleteSavedTripApi = async (placeId) => {
  const response = await apiClient.delete(`/saved-trips/${placeId}`);
  return response.data;
};

export const getMetroStationsApi = async () => {
  const response = await apiClient.get("/transport/stations");
  return response.data;
};

export const getTouristLocationsApi = async () => {
  const response = await apiClient.get("/transport/locations");
  return response.data;
};

export const searchTransportApi = async (payload) => {
  const response = await apiClient.post("/transport/search", payload);
  return response.data;
};

export const getDriverProfileApi = async () => {
  const response = await apiClient.get("/driver/me");
  return response.data;
};

export const updateDriverProfileApi = async (payload) => {
  const response = await apiClient.put("/driver/update", payload);
  return response.data;
};

export const uploadDriverDocsApi = async (formData) => {
  const response = await apiClient.post("/driver/upload-docs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const requestDriverVerificationApi = async () => {
  const response = await apiClient.post("/driver/request-verification");
  return response.data;
};

export const getPendingDriversApi = async () => {
  const response = await apiClient.get("/admin/drivers?status=pending");
  return response.data;
};

export const verifyDriverApi = async (driverId, status) => {
  const response = await apiClient.put(`/admin/drivers/verify/${driverId}`, { status });
  return response.data;
};

export const deleteDriverApi = async (driverId) => {
  const response = await apiClient.delete(`/admin/drivers/${driverId}`);
  return response.data;
};

export const getAllDriversApi = async (params = {}) => {
  const response = await apiClient.get("/admin/drivers", { params });
  return response.data;
};

export const getAllUsersApi = async () => {
  const response = await apiClient.get("/admin/users");
  return response.data;
};

export const deleteUserApi = async (userId) => {
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response.data;
};

export default apiClient;
