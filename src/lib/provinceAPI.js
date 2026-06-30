import api from "./api";

export const getProvinces = async () => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_PROVINCES);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
