import api from "../api";

export const getAdminDashboardSummary = async (accessToken) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_BASE_URL}statistics/admin/dashboard/summary`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (err) {
    console.log({ err });
    throw err?.response?.data ?? err.message;
  }
};
