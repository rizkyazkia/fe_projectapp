import api from "../api";

export const getSchoolDashboardSummary = async (accessToken) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_BASE_URL}statistics/school/dashboard/summary`,
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
