import api from "./api";

export const createHospitalRequest = async (requestData) => {
  const response = await api.post(
    "/hospitals/requests",
    requestData
  );

  return response.data;
};

export const getMyHospitalRequests = async () => {
  const response = await api.get(
    "/hospitals/requests/my"
  );

  return response.data;
};

export const getHospitalRequestById = async (requestId) => {
  const response = await api.get(
    `/hospitals/requests/${requestId}`
  );

  return response.data;
};

export const cancelHospitalRequest = async (requestId) => {
  const response = await api.patch(
    `/hospitals/requests/${requestId}/cancel`
  );

  return response.data;
};