import api from "./api";

export const getCities = async () => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_CITIES);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
