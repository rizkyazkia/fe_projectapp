import api from "../api";

export const getHealthcareDashboardSummary = async (token) => {
  try {
    const response = await api.get(
      `statistics/healthcare/dashboard/summary`,
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
