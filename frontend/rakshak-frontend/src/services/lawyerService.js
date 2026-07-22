import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/lawyers",
});

// Create Legal Help Request
export const createLawyerRequest = async (requestData) => {
  const response = await API.post("/request", requestData);
  return response.data;
};

// Get All Requests
export const getAllLawyerRequests = async () => {
  const response = await API.get("/requests");
  return response.data;
};

// Get Single Request
export const getLawyerRequestById = async (id) => {
  const response = await API.get(`/requests/${id}`);
  return response.data;
};

// Update Request
export const updateLawyerRequest = async (id, data) => {
  const response = await API.put(`/requests/${id}`, data);
  return response.data;
};

// Delete Request
export const deleteLawyerRequest = async (id) => {
  const response = await API.delete(`/requests/${id}`);
  return response.data;
};