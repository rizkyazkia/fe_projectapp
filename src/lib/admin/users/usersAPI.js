import api from "../../api";

export const getAllUsers = async (token, keyword, page, limit) => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_USERS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
