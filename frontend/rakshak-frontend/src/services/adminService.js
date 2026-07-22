import api from "./api";

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.patch(
    `/admin/users/${userId}/role`,
    { role }
  );

  return response.data;
};

export const getAllEmergencies = async () => {
  const response = await api.get("/admin/emergencies");
  return response.data;
};

export const updateEmergencyStatus = async (
  emergencyId,
  status
) => {
  const response = await api.patch(
    `/admin/emergencies/${emergencyId}/status`,
    { status }
  );

  return response.data;
};

export const getAllFIRs = async () => {
  const response = await api.get("/admin/firs");
  return response.data;
};

export const updateFIRStatus = async (firId, updateData) => {
  const response = await api.patch(
    `/admin/firs/${firId}/status`,
    updateData
  );

  return response.data;
};