import api from "./api";

export const startWomenSafetySession = async (sessionData) => {
  const response = await api.post(
    "/women-safety",
    sessionData
  );

  return response.data;
};

export const getCurrentWomenSafetySession = async () => {
  const response = await api.get(
    "/women-safety/current"
  );

  return response.data;
};

export const getWomenSafetyHistory = async () => {
  const response = await api.get(
    "/women-safety/history"
  );

  return response.data;
};

export const updateWomenSafetySession = async (
  id,
  sessionData
) => {
  const response = await api.patch(
    `/women-safety/${id}`,
    sessionData
  );

  return response.data;
};

export const endWomenSafetySession = async (id) => {
  const response = await api.patch(
    `/women-safety/${id}/end`
  );

  return response.data;
};

export const cancelWomenSafetySession = async (id) => {
  const response = await api.patch(
    `/women-safety/${id}/cancel`
  );

  return response.data;
};