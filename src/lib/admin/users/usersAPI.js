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

export const dropUser = async (id, token) => {
  try {
    const response = await api.delete(
      `${import.meta.env.VITE_API_DELETE_USERS}/${id}`,
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

export const getUserById = async (id, token) => {
  try {
    const response = await api.get(`users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
