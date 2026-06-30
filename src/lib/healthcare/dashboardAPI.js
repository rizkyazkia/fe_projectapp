import api from "../api";

export const getHealthcareDashboardSummary = async (token) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_BASE_URL}statistics/healthcare/dashboard/summary`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
