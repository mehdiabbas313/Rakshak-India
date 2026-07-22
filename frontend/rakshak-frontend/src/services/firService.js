import api from "./api";

export const createFIR = async (firData) => {
  const response = await api.post("/firs", firData);
  return response.data;
};

export const getFIRHistory = async () => {
  const response = await api.get("/firs");
  return response.data;
};

export const getFIRById = async (id) => {
  const response = await api.get(`/firs/${id}`);
  return response.data;
};

export const updateFIR = async (id, firData) => {
  const response = await api.put(`/firs/${id}`, firData);
  return response.data;
};

export const deleteFIR = async (id) => {
  const response = await api.delete(`/firs/${id}`);
  return response.data;
};