import api from "./api";

export const createEmergency = async (emergencyData) => {
  const response = await api.post(
    "/emergencies",
    emergencyData
  );

  return response.data;
};

export const getEmergencyHistory = async () => {
  const response = await api.get("/emergencies");

  return response.data;
};

export const getEmergencyById = async (id) => {
  const response = await api.get(
    `/emergencies/${id}`
  );

  return response.data;
};

export const cancelEmergency = async (id) => {
  const response = await api.patch(
    `/emergencies/${id}/cancel`
  );

  return response.data;
};

export const resolveEmergency = async (id) => {
  const response = await api.patch(
    `/emergencies/${id}/resolve`
  );

  return response.data;
};