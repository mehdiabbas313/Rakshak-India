import api from "./api";

export const getNearbyPoliceStations = async (
  latitude,
  longitude,
  radius = 10000
) => {
  const response = await api.get("/maps/police", {
    params: {
      latitude,
      longitude,
      radius,
    },
  });

  return response.data.stations || [];
};

export const getNearbyHospitals = async (
  latitude,
  longitude,
  radius = 10000
) => {
  const response = await api.get("/maps/hospitals", {
    params: {
      latitude,
      longitude,
      radius,
    },
  });

  return response.data.hospitals || [];
};