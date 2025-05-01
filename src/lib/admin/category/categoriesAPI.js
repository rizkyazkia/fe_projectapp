import api from "../../api";

export const getCategories = async (keyword, page, limit) => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_CATEGORIES, {
      params: {
        search: keyword,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
