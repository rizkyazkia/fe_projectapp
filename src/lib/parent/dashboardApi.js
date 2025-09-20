import api from "../api";

export const getDashboardSummary = async (accessToken) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_BASE_URL}statistics/parents/dashboard/summary`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = response.data;

    return data;
  } catch (err) {
    console.log({ err });
    throw err?.response?.data ?? err.message;
  }
};

export const getNutritionDistribution = async () => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_BASE_URL}statistics/admin/nutrition-distribution`
    );
    const data = response.data;

    return data;
  } catch (err) {
    console.log({ err });
    throw err?.response?.data ?? err.message;
  }
};

export const getNutritionDistributionByRegion = async (params = null) => {
  try {
    const response = await api.get(
      `${
        import.meta.env.VITE_BASE_URL
      }statistics/admin/nutrition-each-region?status=${params}`
    );
    const data = response.data;

    return data;
  } catch (err) {
    console.log({ err });
    throw err?.response?.data ?? err.message;
  }
};
