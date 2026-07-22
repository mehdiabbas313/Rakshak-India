import api from "./api";

export const createPoliceRequest = async (requestData) => {
  const response = await api.post(
    "/police-requests",
    requestData
  );

  return response.data;
};

export const getMyPoliceRequests = async () => {
  const response = await api.get("/police-requests");

  return response.data;
};

export const cancelPoliceRequest = async (requestId) => {
  const response = await api.patch(
    `/police-requests/${requestId}/cancel`
  );

  return response.data;
};

export const getAllPoliceRequests = async () => {
  const response = await api.get(
    "/police-requests/staff/all"
  );

  return response.data;
};

export const updatePoliceRequest = async (
  requestId,
  updateData
) => {
  const response = await api.patch(
    `/police-requests/staff/${requestId}`,
    updateData
  );

  return response.data;
};
