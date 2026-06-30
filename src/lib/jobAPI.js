import api from "./api";

export const getJobTypes = async () => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_JOB_TYPES);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
