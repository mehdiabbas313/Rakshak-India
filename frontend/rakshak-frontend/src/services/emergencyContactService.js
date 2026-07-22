import api from "./api";

export const getEmergencyContacts = async () => {
  const response = await api.get("/emergency-contacts");
  return response.data;
};

export const addEmergencyContact = async (contactData) => {
  const response = await api.post(
    "/emergency-contacts",
    contactData
  );

  return response.data;
};

export const updateEmergencyContact = async (
  id,
  contactData
) => {
  const response = await api.put(
    `/emergency-contacts/${id}`,
    contactData
  );

  return response.data;
};

export const deleteEmergencyContact = async (id) => {
  const response = await api.delete(
    `/emergency-contacts/${id}`
  );

  return response.data;
};