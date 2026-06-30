import api from "../api";

export const getPartners = async (keyword, page, limit, token) => {
  try {
    const response = await api.get("partners", {
      headers: { Authorization: `Bearer ${token}` },
      params: { search: keyword, page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const addPartners = async (token, healthcareIds) => {
  try {
    const response = await api.post(
      "partners",
      { healthcareIds },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const deletePartner = async (token, id) => {
  try {
    const response = await api.delete(`partners/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
